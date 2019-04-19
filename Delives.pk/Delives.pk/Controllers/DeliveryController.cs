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
    public class DeliveryController : Controller
    {
        // GET: Delivery
        public ActionResult Index()
        {
            //var searchTerm = ""; // Request.QueryString["q"];
            //ItemSearchModel itemSearchModel = new ItemSearchModel()
            //{
            //    CurrentPage = 1,
            //    ItemsPerPage = 6,
            //    SearchTerm = string.IsNullOrWhiteSpace(searchTerm) ? "" : searchTerm,
            //    Cords = "32.22982263_74.18175494",
            //    Type = []
            //};
            //var searchedResults = await GetItemsAsync(itemSearchModel);
            return View();
        }
        [HttpPost]
        public async Task<PartialViewResult> FetchItemsPartialAsync(ItemSearchModel itemSearchModel)
        {
            List<ItemViewModel> items = await GetItemsAsync(itemSearchModel);
            return PartialView("~/Views/Delivery/_PopularItemsPartial.cshtml", items);
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
    }
}