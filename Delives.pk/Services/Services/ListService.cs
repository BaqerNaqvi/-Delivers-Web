using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Services.DbContext;
using Services.Models;
using System.Data.Entity.Spatial;

namespace Services.Services
{
    public static class ListService
    {
        public static GetListResponseModel GetItemsForList(GetListRequestModel requestModel)
        {
            DbGeography userLoc = null;
            List<string> latlng = new List<string>();
            if (!string.IsNullOrEmpty(requestModel.Cords) && requestModel.Cords != "")
            {
                latlng = requestModel.Cords.Split('_').ToList();
                if (latlng.Count == 2)
                {
                    userLoc = CommonService.ConvertLatLonToDbGeography(latlng[1], latlng[0]); // lat _ lng
                }
            }
            using (var dbContext = new DeliversEntities())
            {
                requestModel.CurrentPage--;
                var response = new GetListResponseModel();
                var newList = new List<ListItemLocal>();

                string searchText = null;
                if (!string.IsNullOrEmpty(requestModel.SearchTerm))
                {
                    searchText = requestModel.SearchTerm.ToLower();
                }

                var list =dbContext.ListItems.Where(item => item.Type == requestModel.Type && 
                (string.IsNullOrEmpty(searchText) || 
                item.Name.ToLower().Contains(searchText) || 
                item.Description.ToLower().Contains(searchText) ||
                (item.ItemDetails.Any(det => det.Name.ToLower().Contains(searchText)))
                )).ToList();
                if (list.Any())
                {                                        
                    var take = list.Skip(requestModel.CurrentPage*requestModel.ItemsPerPage).
                        Take(requestModel.ItemsPerPage).ToList();
                    if (take.Any())
                    {
                        var finals = take.Select(obj => obj.MapListItem()).ToList();
                        ///
                        foreach (var rest in finals)
                        {
                            var dist = CommonService.GetDistance((double)userLoc.Latitude, (double)userLoc.Longitude, Convert.ToDouble(rest.LocationObj.Latitude), Convert.ToDouble(rest.LocationObj.Longitude));
                          //  if ((int)dist < Convert.ToInt16(10))
                            {
                                var disst = Math.Round((double)dist, 2);
                                rest.LocationObj = null;
                                rest.Distance = disst;
                                rest.Name = rest.Name ;
                                newList.Add(rest);
                            }
                        }
                        response.Items = newList.OrderBy( obj => obj.Distance).ToList();
                    }
                }
                response.ItemsPerPage = requestModel.ItemsPerPage;
                response.CurrentPage++;
                response.TotalItems = list.Count;
                return response;
            }
        }

        public static List<ItemDetailLocal_Short> GetMenuByListItemId(long id)
        {
            using (var dbcontext = new DeliversEntities())
            {
                var items = dbcontext.ItemDetails.Where(det => det.ListItemId == id).ToList();
                if (items.Any())
                {
                    return items.Select(obj => obj.ItemDetailShortMapper()).ToList();
                }
                return null;
            }
        }

        public static void AddNewRestaurent(ListItemLocal source)
        {
            using (var dbContext = new DeliversEntities())
            {
                DbGeography loc = null;
                if (!String.IsNullOrEmpty(source.Location) && source.Location != "")
                {
                    var latlng = source.Location.Split('_');
                    if (latlng.Length == 2)
                    {
                        loc = CommonService.ConvertLatLonToDbGeography(latlng[1], latlng[0]); // lat _ lng
                    }
                }
                var dbObj = new ListItem
                {
                    Location = loc,
                    Name = source.Name,
                    Description = source.Description,
                    Phone = source.Phone,
                    LogoImage = source.LogoImage,
                    LastEdit = DateTime.Now,
                    BgImage = source.BgImage,
                    Address = source.Address,
                    Rating = source.Rating,
                    Type = source.Type,
                    Id= source.Id,
                    Status = source.Status,
                    Cords = loc,
                    CreationDate = DateTime.Now                   
                };
                dbContext.ListItems.Add(dbObj);
                dbContext.SaveChanges();
            }
        }

        public static string AddRemove_Favourite_Restaurent(AddFavtItemRequestModel source)
        {
            using (var dbContext = new DeliversEntities())
            {
                var rest = dbContext.ListItems.FirstOrDefault(i => i.Id.ToString()==source.ItemId);
                if (rest != null)
                {
                    var isfavtExist = dbContext.ListItems_Favt.FirstOrDefault(i => i.ItemId.ToString() == source.ItemId
                                      && i.UserId == source.UserId);

                    if ( source.IsFavourite)
                    {
                        if (isfavtExist == null)
                        {
                            var obj = new ListItems_Favt
                            {
                                ItemId = Convert.ToInt64(source.ItemId),
                                DateTime = DateTime.Now,
                                UserId = source.UserId
                            };
                            dbContext.ListItems_Favt.Add(obj);
                            dbContext.SaveChanges();
                            return "Item added as favourite";
                        }
                        else
                        {
                            return "Item already is in favourite";
                        }
                    }
                    else
                    {
                        if (isfavtExist != null)
                        {
                            dbContext.ListItems_Favt.Remove(isfavtExist);
                            dbContext.SaveChanges();
                            return "Item removed from favourite";
                        }
                        return "Item is not in favourite";
                    }
                }
                return "Invalid item";
            }
        }

        public static GetListResponseModel GetI_Favourite_temsForList(GetFavouriteListRequestModel requestModel)
        {
            DbGeography userLoc = null;
            List<string> latlng = new List<string>();
            if (!string.IsNullOrEmpty(requestModel.Cords) && requestModel.Cords != "")
            {
                latlng = requestModel.Cords.Split('_').ToList();
                if (latlng.Count == 2)
                {
                    userLoc = CommonService.ConvertLatLonToDbGeography(latlng[1], latlng[0]); // lat _ lng
                }
            }
            using (var dbContext = new DeliversEntities())
            {
                requestModel.CurrentPage--;
                var response = new GetListResponseModel();
                var newList = new List<ListItemLocal>();

                string searchText = null;
                if (!string.IsNullOrEmpty(requestModel.SearchTerm))
                {
                    searchText = requestModel.SearchTerm.ToLower();
                }

                var list = dbContext.ListItems_Favt.Where(item => 
                 (string.IsNullOrEmpty(searchText) ||
                 item.ListItem.Name.ToLower().Contains(searchText) ||
                 item.ListItem.Description.ToLower().Contains(searchText) ||
                 (item.ListItem.ItemDetails.Any(det => det.Name.ToLower().Contains(searchText)))
                 )).ToList();
                if (list.Any())
                {
                    var take = list.Skip(requestModel.CurrentPage * requestModel.ItemsPerPage).
                        Take(requestModel.ItemsPerPage).ToList();
                    if (take.Any())
                    {
                        var finals = take.Select(obj => obj.ListItem.MapListItem()).ToList();
                        ///
                        foreach (var rest in finals)
                        {
                            var dist = CommonService.GetDistance((double)userLoc.Latitude, (double)userLoc.Longitude, Convert.ToDouble(rest.LocationObj.Latitude), Convert.ToDouble(rest.LocationObj.Longitude));
                            //  if ((int)dist < Convert.ToInt16(20))
                            {
                                var disst = Math.Round((double)dist, 2);
                                rest.LocationObj = null;
                                rest.Distance = disst;
                                rest.Name = rest.Name;
                                newList.Add(rest);
                            }
                        }
                        response.Items = newList.OrderBy(obj => obj.Distance).ToList();
                    }
                }
                response.ItemsPerPage = requestModel.ItemsPerPage;
                response.CurrentPage++;
                response.TotalItems = list.Count;
                return response;
            }
        }
    }
}
