using Delives.pk.Models;
using Delives.pk.Security;
using Delives.pk.Utilities;
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

        public static Uri baseApiUrl = new Uri(CommonFunction.GetWebAPIBaseURL());
        public async Task<ActionResult> Index(int id)
        {
            ViewBag.Title = "Menu ";
            var menuDetails = await GetMenuAsync(id);
            return View(menuDetails);
        }

        private async Task<MenuResponseModel> GetMenuAsync(int id)
        {
            MenuResponseModel responseContent = null;
            using (HttpClient client = new HttpClient())
            {
                string actionPath = "Listing/GetMenu";
                client.BaseAddress = baseApiUrl;
                client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();
                MenuSearchModel msModel = new MenuSearchModel()
                {
                    CurrentPage = 1,
                    ItemsPerPage = Int32.MaxValue,
                    SearchTerm = "",
                    ItemId = id
                };

                HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, msModel);
                if (response.IsSuccessStatusCode)
                {
                    responseContent = await response.Content.ReadAsAsync<MenuResponseModel>();
                }
            }
            return responseContent;
        }
    }
}