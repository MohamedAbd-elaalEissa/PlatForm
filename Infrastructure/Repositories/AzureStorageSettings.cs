﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class AzureStorageSettings
    {
        public string ConnectionString { get; set; }
        public string ContainerName { get; set; }
    }
}
