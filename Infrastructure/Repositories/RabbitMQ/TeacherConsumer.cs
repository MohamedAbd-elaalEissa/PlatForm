//using ApplicationContract.ITeacher;
//using Newtonsoft.Json;
//using RabbitMQ.Client;
//using RabbitMQ.Client.Events;
//using Microsoft.AspNetCore.Connections;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using Domain.Entities;
//using Microsoft.Extensions.DependencyInjection;


/////////////////////////////////////////////////////////Solution 1////////////////////////////////////////////////////////


//namespace Infrastructure.Repositories.RabbitMQ
//{
//    public class TeacherConsumer
//    {
//        private readonly IServiceProvider _serviceProvider;

//        public TeacherConsumer(IServiceProvider serviceProvider)
//        {
//            _serviceProvider = serviceProvider;
//        }
//        public async Task ConsumeAsync()
//        {
//            var factory = new ConnectionFactory()
//            {
//                HostName = "localhost", // Only hostname
//                Port = 5672              // AMQP default port
//            };
//            var connection = await factory.CreateConnectionAsync();
//            var channel = await connection.CreateChannelAsync();

//            await channel.QueueDeclareAsync(queue: "teacherQueue",
//                                 durable: false,
//                                 exclusive: false,
//                                 autoDelete: false,
//                                 arguments: null);

//            var consumer = new AsyncEventingBasicConsumer(channel); // This line now works
//            consumer.ReceivedAsync += async (model, ea) =>
//            {
//                using var scope = _serviceProvider.CreateScope();
//                var teacherRepo = scope.ServiceProvider.GetRequiredService<ITeacherRepository>();
//                var body = ea.Body.ToArray();
//                var message = Encoding.UTF8.GetString(body);
//                var teacher = JsonConvert.DeserializeObject<Teachers>(message);

//               await teacherRepo.CreateAsync(teacher);
//            };

//            await channel.BasicConsumeAsync(queue: "teacherQueue",
//                                 autoAck: true,
//                                 consumer: consumer);
//        }
//    }
//}
/////////////////////////////////////////////////////////Solution 2////////////////////////////////////////////////////////

using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using Newtonsoft.Json;
using Domain.Entities;
using ApplicationContract.ITeacher;
using ApplicationContract.Models.RabbitMQ;

namespace Infrastructure.Repositories.RabbitMQ
{
    public class TeacherConsumerHostedService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private IConnection _connection;
        private IChannel _channel;

        public TeacherConsumerHostedService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        private async Task InitializeRabbitMQAsync()
        {
            var factory = new ConnectionFactory()
            {
                //HostName = "localhost",
                //Port = 5672
                Uri = new Uri("amqps://uhulsxor:8v1BskBvaS1_MOpp6K-qyTghk5PX5ibT@woodpecker.rmq.cloudamqp.com/uhulsxor"),

            };

            _connection = await factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            await _channel.QueueDeclareAsync(
                queue: "teacherQueue",
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
                var teacherRepo = scope.ServiceProvider.GetRequiredService<ITeacherRepository>();

                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                var teacherDTO = JsonConvert.DeserializeObject<MessageDto>(message);

                if (teacherDTO != null)
                {
                    var teacher = new Teachers();

                    if (!string.IsNullOrWhiteSpace(teacherDTO.userName))
                    {
                        var parts = teacherDTO.userName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);

                        teacher.FirstName = parts.Length > 0 ? parts[0] : null;
                        teacher.LastName = parts.Length > 1 ? parts[1] : null;
                    }

                    teacher.Email = teacherDTO.email;
                    teacher.PhoneNumber = teacherDTO.phoneNumber;

                    await teacherRepo.CreateAsync(teacher);
                }
            };

            await _channel.BasicConsumeAsync(
                queue: "teacherQueue",
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

