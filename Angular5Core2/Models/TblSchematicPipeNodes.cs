using System;
using System.Collections.Generic;

namespace Angular5Core2.Models
{
    public partial class TblSchematicPipeNodes
    {
        public int Id { get; set; }
        public int PipeFk { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public int Nodeindex { get; set; }
    }
}
