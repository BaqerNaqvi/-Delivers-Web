using Delives.pk.Models;
using Delives.pk.Security;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Delives.pk.Controllers
{
    public class ListController : Controller
    {
        // GET: Search
        public ActionResult Index()
        {
            //var searchTerm = Request.QueryString["q"];

            //ItemSearchModel itemSearchModel = new ItemSearchModel()
            //{
            //    CurrentPage = 1,
            //    ItemsPerPage = 10,
            //    SearchTerm = string.IsNullOrWhiteSpace(searchTerm) ? "" : searchTerm,
            //    Cords = "32.22982263_74.18175494",
            //    DistanceFrom = 0,
            //    DistanceTo = 5,
            //    Rating = 1,
            //    Type = 1
            //};
            //var searchedResults = await GetItemsAsync(itemSearchModel);
            return View();
        }
        [HttpPost]
        public async Task<PartialViewResult> FetchItemsPartialAsync(ItemSearchModel itemSearchModel)
        {
            List<ItemViewModel> items = await GetItemsAsync(itemSearchModel);
            return PartialView("~/Views/List/_ListItemPartial.cshtml", items);
        }
        private async Task<List<ItemViewModel>> GetItemsAsync(ItemSearchModel itemSearchModel)
        {
            string path = "http://www.delivers.pk/api/Listing/GetItems";
            SearchResponseModel responseContent = null;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(path);
                client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();

                //client.BaseAddress = new Uri(path);
                HttpResponseMessage response = await client.PostAsJsonAsync(path, itemSearchModel);
                if (response.IsSuccessStatusCode)
                {
                    responseContent = await response.Content.ReadAsAsync<SearchResponseModel>();
                }
            }
            var json = JsonConvert.SerializeObject(responseContent.Data);
            var itemsResponseModel = JsonConvert.DeserializeObject<ItemsResponseModel>(json);
            return itemsResponseModel.Items;
        }
        [HttpPost]
        public async Task<PartialViewResult> FetchItemTypesPartialAsync(ItemTypeViewModel itemTypeViewModel)
        {
            List<ItemTypeViewModel> items = await GetItemTypesAsync(itemTypeViewModel);
            return PartialView("~/Views/List/_ListItemTypePartial.cshtml", items);
        }
        private async Task<List<ItemTypeViewModel>> GetItemTypesAsync(ItemTypeViewModel itemTypeViewModel)
        {
            string path = "http://www.delivers.pk/api/Listing/GetCatogries";
            SearchResponseModel responseContent = null;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(path);
                client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();

                //client.BaseAddress = new Uri(path);
                HttpResponseMessage response = await client.PostAsJsonAsync(path, itemTypeViewModel);
                if (response.IsSuccessStatusCode)
                {
                    responseContent = await response.Content.ReadAsAsync<SearchResponseModel>();
                }
            }
            var json = JsonConvert.SerializeObject(responseContent.Data);
            var itemsResponseModel = JsonConvert.DeserializeObject<List<ItemTypeViewModel>>(json);
            return itemsResponseModel;
        }
    }
}