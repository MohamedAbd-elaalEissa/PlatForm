using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class NotificationHub: Hub
    {
        public async Task SendNotification(string userId,string message)
        {
            //await Clients.Users(userId).SendAsync("ReceiveNotification", message);
            await Clients.All.SendAsync("ReceiveNotification", message);
        }
    }
}
