//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Services.DbContext
{
    using System;
    using System.Collections.Generic;
    
    public partial class Rider_Location_Map
    {
        public long Id { get; set; }
        public string UserId { get; set; }
        public System.Data.Entity.Spatial.DbGeography Location { get; set; }
        public System.DateTime LastUpdated { get; set; }
    
        public virtual AspNetUser AspNetUser { get; set; }
    }
}
