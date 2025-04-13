using Infrastructure.Presistence;
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
        private readonly PlatFormDbContext _context;

        public NotificationHub(PlatFormDbContext context)
        {
            _context = context;
        }
        public override Task OnConnectedAsync()
        {
            string email = Context.GetHttpContext().Request.Query["email"];
            if (!string.IsNullOrEmpty(email))
            {
                UserConnectionManager.AddConnection(email, Context.ConnectionId);
            }
            else
            {
                throw new Exception("Email is required");
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            string email = Context.GetHttpContext().Request.Query["email"];
            if (!string.IsNullOrEmpty(email))
            {
                UserConnectionManager.RemoveConnection(email, Context.ConnectionId);
            }
            return base.OnDisconnectedAsync(exception);
        }
        public async Task GetMissedMessages(string email)
        {
            var messages = await OfflineMessageManager.GetMessages(_context,email);
            foreach (var msg in messages)
            {
                await Clients.Caller.SendAsync("ReceiveNotification", msg);
            }
            await OfflineMessageManager.ClearMessages(_context,email);
        }
    }
}
