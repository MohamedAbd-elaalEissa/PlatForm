using Domain.Entities;
using Infrastructure.Presistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories.SignalR
{
    public static class OfflineMessageManager
    {
        public static async Task SaveMessage(PlatFormDbContext context, string email, string message)
        {
            context.OfflineMessage.Add(new OfflineMessage
            {
                UserEmail = email,
                Message = message
            });
            await context.SaveChangesAsync();
        }
        public static async Task<List<string>> GetMessages(PlatFormDbContext context, string email)
        {
            var messages = await context.OfflineMessage
                .Where(m => m.UserEmail == email)
                .Select(m => m.Message)
                .ToListAsync();
            return messages;
        }
        public static async Task ClearMessages(PlatFormDbContext context, string email)
        {
            var messages = await context.OfflineMessage
                .Where(m => m.UserEmail == email)
                .ToListAsync();
            context.OfflineMessage.RemoveRange(messages);
            await context.SaveChangesAsync();
        }
    }
}
