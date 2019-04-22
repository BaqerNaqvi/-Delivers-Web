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
    public class CartController : Controller
    {
        public async Task<ActionResult> Index()
        {
            string path = "http://www.delivers.pk/api/Account/GetUserInfo";
            UserInfoInCartResponseModel responseContent = null;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(path);
                var byteArray = Encoding.ASCII.GetBytes("0336633663:Sp@cein786");
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

                //client.BaseAddress = new Uri(path);
                UserInfoRequestModel msModel = new UserInfoRequestModel()
                {
                    UserId = "33669f22-43da-4f5d-b801-91ade07afc5d"
                };

                HttpResponseMessage response = await client.PostAsJsonAsync(path, msModel);
                if (response.IsSuccessStatusCode)
                {
                    responseContent = await response.Content.ReadAsAsync<UserInfoInCartResponseModel>();
                }
            }
            return View(responseContent);
        }

        [HttpPost]
        public async Task<JsonResult> UpdateUserInfo(UpdateUserInfoRequestModel userObj)
        {
            //UpdateUserInfoRequestModel
            string path = "http://www.delivers.pk/api/Account/UpdateProfile";
            UserInfoInCartResponseModel responseContent = null;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(path);
                var byteArray = Encoding.ASCII.GetBytes("0336633663:Sp@cein786");
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

                //client.BaseAddress = new Uri(path);

                //validate the userobj before sending it fruther to prevent sql injections and stuff 

                //here

                HttpResponseMessage response = await client.PostAsJsonAsync(path, userObj);
                if (response.IsSuccessStatusCode)
                {
                    responseContent = await response.Content.ReadAsAsync<UserInfoInCartResponseModel>(); 
                }
            }

            return Json(responseContent);
        }

        [HttpPost]
        //
        public async Task<JsonResult> PlaceOrder(PlaceOrderRequestModelLocal userObj)
        {
            string path = "http://www.delivers.pk/api/order/place";
            PlaceOrderResponseModel responseContent = null;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(path);
                var byteArray = Encoding.ASCII.GetBytes("0336633663:Sp@cein786");
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

                //client.BaseAddress = new Uri(path);

                //validate the userobj before sending it fruther to prevent sql injections and stuff 

                //here

                HttpResponseMessage response = await client.PostAsJsonAsync(path, userObj);
                if (response.IsSuccessStatusCode)
                {
                    responseContent = await response.Content.ReadAsAsync<PlaceOrderResponseModel>();
                }
            }

            return Json(responseContent);
        }
            public async Task<ActionResult> Snapshot()
        {
            //var searchTerm = Request.QueryString["q"];
            //var menuDetails = await GetMenuAsync(id);
            return View("Snapshot/Index");
        }


    }
}