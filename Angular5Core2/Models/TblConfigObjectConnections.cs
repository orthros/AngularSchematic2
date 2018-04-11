using System;
using System.Collections.Generic;

namespace Angular5Core2.Models
{
    public partial class TblConfigObjectConnections
    {
        public int Id { get; set; }
        public int LeftObjectFk { get; set; }
        public int RightObjectFk { get; set; }
        public byte Direction { get; set; }
    }
}
