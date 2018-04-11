using System;
using System.Collections.Generic;

namespace Angular5Core2.Models
{
    public partial class TblConfigObject
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public byte Type { get; set; }
        public float X { get; set; }
        public float Y { get; set; }
        public float Scale { get; set; }
        public int LeftAssetFk { get; set; }
    }
}
