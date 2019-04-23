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
            try
            {
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
                System.Web.HttpContext.Current.Session["ConfirmedOrderIds"] = responseContent.OrderId;
            }
            catch (Exception e)
            {
                //log ex here
                //throw;
            }

            
            
            return Json(responseContent);
        }
        
        [HttpGet]
        public async Task<ActionResult> OrderConfirmed(List<string> OrderIds)
        {
            string path = "http://www.delivers.pk/api/order/getDetails";
            OrderConfirmedResponseModel responseContent = null;

            List<OrderLocal> returnObj = new List<OrderLocal>(); 

            try
            {
                var OrderIdsList = System.Web.HttpContext.Current.Session["ConfirmedOrderIds"] as List<string>;
                
                //System.Web.HttpContext.Current.Session["ConfirmedOrderIds"] = null;


                //OrderIdsList

                foreach (var item in OrderIdsList)
                {
                    using (HttpClient client = new HttpClient())
                    {
                        client.BaseAddress = new Uri(path);
                        var byteArray = Encoding.ASCII.GetBytes("0336633663:Sp@cein786");
                        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

                        //client.BaseAddress = new Uri(path);
                        OrderConfirmedRequestModel msModel = new OrderConfirmedRequestModel()
                        {
                            OrderId = item
                        };

                        HttpResponseMessage response = await client.PostAsJsonAsync(path, msModel);
                        if (response.IsSuccessStatusCode)
                        {
                            responseContent = await response.Content.ReadAsAsync<OrderConfirmedResponseModel>();
                        }

                        if (responseContent!=null)
                        {
                            returnObj.Add(responseContent.Data);
                        }
                    }
                }
                
                
            }
            catch (Exception e)
            {
                //log here
//                throw;
            }
            
            return View("~/Views/Cart/Confirmed/Index.cshtml",returnObj);
        }

        public async Task<ActionResult> Snapshot()
        {
            //var searchTerm = Request.QueryString["q"];
            //var menuDetails = await GetMenuAsync(id);
            return View("Snapshot/Index");
        }


    }
}