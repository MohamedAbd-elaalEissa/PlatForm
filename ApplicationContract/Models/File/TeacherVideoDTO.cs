﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models.File
{
    public class TeacherVideoDTO
    {
        public int TeacherId { get; set; }
        public string VideoName { get; set; }
        public int? AcademicLevelId { get; set; }
        public int ChapterId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 25;
    }
}
