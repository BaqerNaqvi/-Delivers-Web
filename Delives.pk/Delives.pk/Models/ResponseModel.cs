using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Delives.pk.Models
{
    public class ResponseModel
    {
        public bool Success { get; set; }

        public List<string> Messages { get; set; }

        public Object Data { get; set; }
    }

}