namespace Infrastructure.Repositories.SignalR
{
    public static class UserConnectionManager
    {
        private static readonly Dictionary<string, List<string>> _connections = new Dictionary<string, List<string>>();
        public static void AddConnection(string email, string connectionId)
        {
            lock (_connections)
            {
                if (!_connections.ContainsKey(email))
                {
                    _connections[email] = new List<string>();
                }
                _connections[email].Add(connectionId);
            }
        }
        public static void RemoveConnection(string email, string connectionId)
        {
            lock (_connections)
            {
                if (_connections.ContainsKey(email))
                {
                    _connections[email].Remove(connectionId);
                    if (_connections[email].Count == 0)
                        _connections.Remove(email);
                }
            }
        }
        public static List<string> GetConnections(string email)
        {
            lock (_connections)
            {
                return _connections.ContainsKey(email) ? _connections[email] : new List<string>();
            }
        }
        public static bool IsOnline(string email)
        {
            lock (_connections)
            {
                return _connections.ContainsKey(email) && _connections[email].Count > 0;
            }
        }
    }
}
