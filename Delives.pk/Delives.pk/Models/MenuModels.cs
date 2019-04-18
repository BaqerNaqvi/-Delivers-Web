using Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Delives.pk.Models
{
    public class MenuModels
    {
        public class MenuSearchModel : RequestModel
        {
            public int ItemId { get; set; }
        }

        public class MenuViewModel
        {
            public long Id { get; set; }
            public string Name { get; set; }
            public int Price { get; set; }

            public string Image { get; set; }
        }

        public class MenuResponseModel
        {
            public List<MenuViewModel> Data { get; set; }
            public string Success { get; set; }
            public List<string> Messages { get; set; }
        }

        public class SearchMenuResponseModel
        {
            public MenuResponseModel Data { get; set; }
            public string Success { get; set; }
            public List<string> Messages { get; set; }
        }
    }
}