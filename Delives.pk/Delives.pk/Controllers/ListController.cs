using Delives.pk.Models;
using System;
using System.Collections.Generic;
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
        public async Task<ActionResult> Index()
        {
            var searchTerm = Request.QueryString["q"];

            ItemSearchModel itemSearchModel = new ItemSearchModel()
            {
                CurrentPage = 1,
                ItemsPerPage = 10,
                SearchTerm = string.IsNullOrWhiteSpace(searchTerm) ? "" : searchTerm,
                Cords = "32.22982263_74.18175494",
                Type = 1
            };
            var searchedResults = await GetItemsAsync(itemSearchModel);
            return View(searchedResults);
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
                var byteArray = Encoding.ASCII.GetBytes("0336633663:Sp@cein786");
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
                
                //client.BaseAddress = new Uri(path);
                HttpResponseMessage response = await client.PostAsJsonAsync(path, itemSearchModel);
                if (response.IsSuccessStatusCode)
                {
                    responseContent = await response.Content.ReadAsAsync<SearchResponseModel>();
                }
            }
            return responseContent.Data.Items;
        }
    }
}