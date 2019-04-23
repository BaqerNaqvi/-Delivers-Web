using Delives.pk.Models;
using Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using static Delives.pk.Models.MenuModels;

namespace Delives.pk.Controllers
{
    public class MenuController : Controller
    {
        // GET: Menu
       

        public async Task<ActionResult> Index(int id)
        {
            //var searchTerm = Request.QueryString["q"];
            var menuDetails = await GetMenuAsync(id);
            return View(menuDetails);
        }

        private async Task<MenuResponseModel> GetMenuAsync(int id)
        {
            string path = "http://www.delivers.pk/api/Listing/GetMenu";
            MenuResponseModel responseContent = null;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(path);
                var byteArray = Encoding.ASCII.GetBytes("0336633663:Sp@cein786");
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

                //client.BaseAddress = new Uri(path);
                MenuSearchModel msModel = new MenuSearchModel()
                {
                    CurrentPage = 1,
                    ItemsPerPage = Int32.MaxValue,
                    SearchTerm = "",
                    ItemId = id
                };

                HttpResponseMessage response = await client.PostAsJsonAsync(path, msModel);
                if (response.IsSuccessStatusCode)
                {
                    responseContent = await response.Content.ReadAsAsync<MenuResponseModel>();
                }
            }
            return responseContent;
        }
    }
}