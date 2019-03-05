using Services.DbContext;
using Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public static class RestuarantService
    {
        public static ListItemLocal GetRestaurantForUserId(string userid)
        {
            using (var dbContext = new DeliversEntities())
            {
                var restaurantMap = dbContext.User_Rest_Map.FirstOrDefault(r => r.UserId == userid);
                if(restaurantMap!=null)
                {
                    var res = dbContext.ListItems.FirstOrDefault(l => l.Id == restaurantMap.RestId);
                    if (res != null)
                    {
                        return res.MapListItem();
                    }
                }
                return null;
            }
        }
    }
}
