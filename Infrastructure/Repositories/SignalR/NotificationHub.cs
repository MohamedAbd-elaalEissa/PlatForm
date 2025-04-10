using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories.SignalR
{
    // [Authorize]
    public class NotificationHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> _connections = new ConcurrentDictionary<string, string>();

        public override Task OnConnectedAsync()
        {
            string email = Context.GetHttpContext().Request.Query["email"];
            if (!string.IsNullOrEmpty(email))
            {
                _connections.TryAdd(email, Context.ConnectionId);
            }
            else
            {
                throw new Exception("Email is required");
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var email = _connections.FirstOrDefault(c => c.Value == Context.ConnectionId).Key;
            if (!string.IsNullOrEmpty(email))
            {
                _connections.TryRemove(email, out _);
            }
            return base.OnDisconnectedAsync(exception);
        }
        public async Task SendNotification(string email, string message)
        {
            if (_connections.TryGetValue(email, out var connectionId))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveNotification", message);
            }
            //await Clients.All.SendAsync("ReceiveNotification", message);
        }
        public static string GetConnectionId(string email)
        {
            _connections.TryGetValue(email, out var connectionId);
            return connectionId;
        }
    }
}
