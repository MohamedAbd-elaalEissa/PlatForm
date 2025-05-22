using ApplicationContract.IStudent;
using ApplicationContract.Models.RabbitMQ;
using Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace Infrastructure.Repositories.RabbitMQ
{
    public class StudentConsumerHostedService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private IConnection _connection;
        private IChannel _channel;

        public StudentConsumerHostedService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        private async Task InitializeRabbitMQAsync()
        {
            var factory = new ConnectionFactory()
            {
                //HostName = "rabbitmq",
                //UserName = "guest",
                //Password = "guest",
                //Port = 5672
                Uri = new Uri("amqps://uhulsxor:8v1BskBvaS1_MOpp6K-qyTghk5PX5ibT@woodpecker.rmq.cloudamqp.com/uhulsxor"),

            };

            _connection = await factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            await _channel.QueueDeclareAsync(
                queue: "studentQueue",
                durable: false,
                exclusive: false,
                autoDelete: false,
                arguments: null
            );
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await InitializeRabbitMQAsync();

            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.ReceivedAsync += async (model, ea) =>
            {
                if (stoppingToken.IsCancellationRequested)
                    return;

                using var scope = _serviceProvider.CreateScope();
                var studentRepo = scope.ServiceProvider.GetRequiredService<IStudentRepository>();

                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                var studentDTO = JsonConvert.DeserializeObject<MessageDto>(message);

                if (studentDTO != null)
                {
                    var student = new Students();

                    if (!string.IsNullOrWhiteSpace(studentDTO.userName))
                    {
                        var parts = studentDTO.userName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);

                        student.FirstName = parts.Length > 0 ? parts[0] : null;
                        student.LastName = parts.Length > 1 ? parts[1] : null;
                    }

                    student.Email = studentDTO.email;
                    student.PhoneNumber = studentDTO.phoneNumber;

                    await studentRepo.CreateAsync(student);
                }
            };

            await _channel.BasicConsumeAsync(
                queue: "studentQueue",
                autoAck: true,
                consumer: consumer
            );

            // Keep task alive until cancellation
            await Task.Delay(Timeout.Infinite, stoppingToken);
        }

        public override void Dispose()
        {
            if (_channel != null)
            {
                _channel.DisposeAsync().AsTask().GetAwaiter().GetResult();
            }

            if (_connection != null)
            {
                _connection.CloseAsync(200, "Normal shutdown", TimeSpan.FromSeconds(10)).GetAwaiter().GetResult();
                _connection.Dispose();
            }

            base.Dispose();
        }
    }
}
