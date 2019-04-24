using Delives.pk.Models;
using Delives.pk.Security;
using Delives.pk.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
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
        public async Task<JsonResult> FetchItemsPartialAsync(ItemSearchModel itemSearchModel)
        {
            ResponseModel searchResponseModel = new ResponseModel()
            {
                Success = false,
                Data = null,

            };
            try
            {
                ItemsResponseModel itemsResponseModel = await GetItemsAsync(itemSearchModel);
                if (itemsResponseModel != null)
                {
                    if (itemsResponseModel.TotalItems == 0)
                    {
                        return Json(new { Success = true, Status= HttpStatusCode.NotFound, Message = "No item(s) found" }, JsonRequestBehavior.AllowGet);
                    }
                    else if (itemsResponseModel.TotalItems <= (itemsResponseModel.CurrentPage * itemsResponseModel.ItemsPerPage))
                    {
                        var html = RenderRazorViewToString("~/Views/List/_ListItemPartial.cshtml", itemsResponseModel.Items);
                        return Json(new { Success = true, Status = HttpStatusCode.ResetContent, Message = "Change filters to search for more items" }, JsonRequestBehavior.AllowGet);
                    }
                    else if (itemsResponseModel.Items != null)
                    {
                        var html = RenderRazorViewToString("~/Views/List/_ListItemPartial.cshtml", itemsResponseModel.Items);
                        return Json(new { Success = true, Status = HttpStatusCode.OK, Message = "", Object = itemsResponseModel.Items, Html = html }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { Success = false, Status = HttpStatusCode.InternalServerError, Message = "Something went wrong while fetching items" }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { Success = false, Status = HttpStatusCode.InternalServerError, Message = "Something went wrong while fetching items" }, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json(new { Success = false, Status = HttpStatusCode.InternalServerError, Message = "Something went wrong while fetching items" }, JsonRequestBehavior.AllowGet);
            }
        }
        private async Task<ItemsResponseModel> GetItemsAsync(ItemSearchModel itemSearchModel)
        {
            try
            {
                string actionPath = "Listing/GetItems";
                ResponseModel responseContent = null;
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(CommonFunction.GetWebAPIBaseURL());
                    client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();
                    HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, itemSearchModel);
                    if (response.IsSuccessStatusCode)
                    {
                        responseContent = await response.Content.ReadAsAsync<ResponseModel>();
                    }
                }
                if (responseContent != null && responseContent.Success)
                {
                    var json = JsonConvert.SerializeObject(responseContent.Data);
                    var itemsResponseModel = JsonConvert.DeserializeObject<ItemsResponseModel>(json);
                    return itemsResponseModel;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        [HttpPost]
        public async Task<PartialViewResult> FetchItemTypesPartialAsync(ItemTypeViewModel itemTypeViewModel)
        {
            List<ItemTypeViewModel> items = await GetItemTypesAsync(itemTypeViewModel);
            return PartialView("~/Views/List/_ListItemTypePartial.cshtml", items);
        }
        private async Task<List<ItemTypeViewModel>> GetItemTypesAsync(ItemTypeViewModel itemTypeViewModel)
        {
            try
            {
                string actionPath = "Listing/GetCatogries";
                ResponseModel responseContent = null;
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(CommonFunction.GetWebAPIBaseURL()); ;
                    client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();

                    //client.BaseAddress = new Uri(path);
                    HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, itemTypeViewModel);
                    if (response.IsSuccessStatusCode)
                    {
                        responseContent = await response.Content.ReadAsAsync<ResponseModel>();
                    }
                }
                if (responseContent != null && responseContent.Success)
                {
                    var json = JsonConvert.SerializeObject(responseContent.Data);
                    var itemsResponseModel = JsonConvert.DeserializeObject<List<ItemTypeViewModel>>(json);
                    return itemsResponseModel;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        #region UtilityFunction
        public string RenderRazorViewToString(string viewName, object model)
        {
            ViewData.Model = model;
            using (var sw = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(ControllerContext, viewName);
                var viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);
                viewResult.ViewEngine.ReleaseView(ControllerContext, viewResult.View);
                return sw.GetStringBuilder().ToString();
            }
        }
        #endregion
    }
}