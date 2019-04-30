using Delives.pk.Models;
using Delives.pk.Security;
using Delives.pk.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;




namespace Delives.pk.Controllers
{
    [Authorize]
    public class CartController : Controller
    {
        public static Uri baseApiUrl = new Uri(CommonFunction.GetWebAPIBaseURL());
        public async Task<ActionResult> Index()
        {

            UserInfoInCartResponseModel responseContent = null;
            using (HttpClient client = new HttpClient())
            {
                var uid = User.Identity.GetUserId();
                string actionPath = "Account/GetUserInfo";
                client.BaseAddress = baseApiUrl;
                client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();
                UserInfoRequestModel msModel = new UserInfoRequestModel()
                {
                    UserId = uid//"33669f22-43da-4f5d-b801-91ade07afc5d"
                };

                HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, msModel);
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
            UserInfoInCartResponseModel responseContent = null;
            using (HttpClient client = new HttpClient())
            {
                string actionPath = "Account/UpdateProfile";
                client.BaseAddress = baseApiUrl;
                client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();

                //validate the userobj before sending it fruther to prevent sql injections and stuff 

                //here

                HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, userObj);
                if (response.IsSuccessStatusCode)
                {
                    responseContent = await response.Content.ReadAsAsync<UserInfoInCartResponseModel>();
                }
            }

            return Json(responseContent);
        }

        [HttpPost]
        public async Task<JsonResult> PlaceOrder(PlaceOrderRequestModelLocal userObj)
        {
            PlaceOrderResponseModel responseContent = null;
            try
            {
                userObj.OrderPlacedById= User.Identity.GetUserId();
                userObj.FromWeb = true;
                using (HttpClient client = new HttpClient())
                {
                    string actionPath = "order/place";
                    client.BaseAddress = baseApiUrl;
                    client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();
                    HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, userObj);
                    if (response.IsSuccessStatusCode)
                    {
                        responseContent = await response.Content.ReadAsAsync<PlaceOrderResponseModel>();
                    }
                }
                System.Web.HttpContext.Current.Session["ConfirmedOrderSerialNo"] = responseContent.SerialNo;
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
            OrderConfirmedResponseModel responseContent = null;

            try
            {
                var OrderSerialNo = System.Web.HttpContext.Current.Session["ConfirmedOrderSerialNo"] as string;
                using (HttpClient client = new HttpClient())
                {
                    string actionPath = "order/getDetailsBySerialNo";
                    client.BaseAddress = baseApiUrl;
                    client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();
                    OrderConfirmedRequestModel msModel = new OrderConfirmedRequestModel()
                    {
                        SerialNo = OrderSerialNo
                    };

                    HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, msModel);
                    if (response.IsSuccessStatusCode)
                    {
                        responseContent = await response.Content.ReadAsAsync<OrderConfirmedResponseModel>();
                    }

                }

            }
            catch (Exception e)
            {
                //log here
                //                throw;
            }

            return View("~/Views/Cart/Confirmed/Index.cshtml", responseContent);
        }


        [HttpPost]
        public async Task<JsonResult> FetchDeliveryChargesAndTime(PlaceOrderRequestModelLocal userObj)
        {
            DeliveryChargesResponseModel responseContent = null;
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    string actionPath = "order/estimatedDeliveryCharges";
                    client.BaseAddress = baseApiUrl;
                    client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();

                    //validate the userobj before sending it fruther to prevent sql injections and stuff 

                    //here

                    HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, userObj);
                    if (response.IsSuccessStatusCode)
                    {
                        responseContent = await response.Content.ReadAsAsync<DeliveryChargesResponseModel>();
                    }
                }
            }
            catch (Exception e)
            {
                //log ex here
                //throw;
            }



            return Json(responseContent);
        }

        public async Task<ActionResult> Snapshot()
        {
            return View("Snapshot/Index");
        }


    }
}