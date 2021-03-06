﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Delives.pk.Models;
using System.Net.Http;
using Delives.pk.Security;
using Newtonsoft.Json;
using System.Net;
using Delives.pk.Utilities;

namespace Delives.pk.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            return RedirectToAction("Index", "List");
            //ViewBag.ReturnUrl = returnUrl;
            //if (returnUrl != "")
            //{
            //    return Json(true, JsonRequestBehavior.AllowGet);
            //}
            //else
            //{
            //    return View();
            //}
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            try
            {
                //if (!ModelState.IsValid)
                //{
                //    return Json(new { Success = false, Status = 5, Message = "Required data is missing" }, JsonRequestBehavior.AllowGet);
                //}
                string actionPath = "Account/Login";
                ResponseModel responseContent = null;
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(CommonFunction.GetWebAPIBaseURL());
                    client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();

                    //client.BaseAddress = new Uri(path);
                    HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, model);
                    if (response.IsSuccessStatusCode)
                    {
                        responseContent = await response.Content.ReadAsAsync<ResponseModel>();
                    }
                }
                if (responseContent != null)
                {
                    var json = JsonConvert.SerializeObject(responseContent.Data);
                    var itemsResponseModel = JsonConvert.DeserializeObject<UserModel>(json);
                    switch (responseContent.Code)
                    {
                        case 1:
                            var result = await SignInManager.PasswordSignInAsync(model.PhoneNumber, model.Password, model.RememberMe, shouldLockout: false);
                            return Json(new { Success = true, Status = responseContent.Code, Message = "Login successful", Object = new { UserId = itemsResponseModel.Id != Guid.Empty ? itemsResponseModel.Id : itemsResponseModel.UserId } }, JsonRequestBehavior.AllowGet);
                        case 2:
                            return Json(new { Success = true, Status = responseContent.Code, Message = "Please verify phone number", Object = new { UserId = itemsResponseModel.Id != Guid.Empty ? itemsResponseModel.Id : itemsResponseModel.UserId } }, JsonRequestBehavior.AllowGet);
                        case 3:
                            var user = UserManager.Find(model.PhoneNumber, model.Password);
                            return Json(new { Success = false, Status = responseContent.Code, Message = "Invalid login type" }, JsonRequestBehavior.AllowGet);
                        case 4:
                        default:
                            ModelState.AddModelError("", "Invalid login attempt.");
                            return Json(new { Success = false, Status = responseContent.Code, Message = "Invalid phone number/password" }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { Success = false, Status = 5, Message = "Something went wrong while login attempt" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, Status = 5, Message = "Something went wrong while login attempt" }, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // GET: /Account/VerifyCode
        [AllowAnonymous]
        public async Task<ActionResult> VerifyCode(string provider, string returnUrl, bool rememberMe)
        {
            // Require that the user has already logged in via username/password or external login
            if (!await SignInManager.HasBeenVerifiedAsync())
            {
                return View("Error");
            }
            return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/VerifyCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes. 
            // If a user enters incorrect codes for a specified amount of time then the user account 
            // will be locked out for a specified amount of time. 
            // You can configure the account lockout settings in IdentityConfig
            var result = await SignInManager.TwoFactorSignInAsync(model.Provider, model.Code, isPersistent: model.RememberMe, rememberBrowser: model.RememberBrowser);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(model.ReturnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid code.");
                    return View(model);
            }
        }

        //
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        public async Task<JsonResult> Register(RegisterViewModel model)
        {
            try
            {
                //if (!ModelState.IsValid)
                //{
                //    return Json(new { Success = false, Status = 5, Message = "Required data is missing" }, JsonRequestBehavior.AllowGet);
                //}
                string actionPath = "Account/Registration";
                ResponseModel responseContent = null;
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(CommonFunction.GetWebAPIBaseURL());
                    client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();

                    //client.BaseAddress = new Uri(path);
                    HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, model);
                    if (response.IsSuccessStatusCode)
                    {
                        responseContent = await response.Content.ReadAsAsync<ResponseModel>();
                    }
                }
                if (responseContent != null && responseContent.Success)
                {
                    var json = JsonConvert.SerializeObject(responseContent.Data);
                    var itemsResponseModel = JsonConvert.DeserializeObject<UserModel>(json);
                    return Json(new { Success = true, Message = "Registeration successful", Object = new { UserId = itemsResponseModel.Id != Guid.Empty ? itemsResponseModel.Id : itemsResponseModel.UserId, itemsResponseModel.PhoneNumber } }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { Success = false, Message = String.Join("\n", responseContent.Messages) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, Message = "Something went wrong while registration" }, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // GET: /Account/ConfirmEmail
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> VerifyPhoneNumber(VerifyPhoneNumberCustomeModel model)
        {
            try
            {
                //if (!ModelState.IsValid)
                //{
                //    return Json(new { Success = false, Message = "Either UserId or Code is empty" }, JsonRequestBehavior.AllowGet);
                //}
                string actionPath = "Account/VerifyPhoneNumber";
                ResponseModel responseContent = null;
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(CommonFunction.GetWebAPIBaseURL());
                    client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();

                    //client.BaseAddress = new Uri(path);
                    HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, model);
                    if (response.IsSuccessStatusCode)
                    {
                        responseContent = await response.Content.ReadAsAsync<ResponseModel>();
                    }
                }
                if (responseContent != null && responseContent.Success)
                {
                    var user = UserManager.FindById(model.UserId);
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                    return Json(new { Success = responseContent.Success, Message = String.Join(" ", responseContent.Messages) }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { Success = responseContent.Success, Message = String.Join(" ", responseContent.Messages) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, Message = "Something went wrong while verifying phone number" }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(GetPhoneNumberCodeModel model)
        {
            try
            {
                //if (!ModelState.IsValid)
                //{
                //    return Json(new { Success = false, Message = "Either UserId or Code is empty" }, JsonRequestBehavior.AllowGet);
                //}
                string actionPath = "User/RequestResetPassword";
                ResponseModel responseContent = null;
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(CommonFunction.GetWebAPIBaseURL());
                    client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();

                    //client.BaseAddress = new Uri(path);
                    HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, model);
                    if (response.IsSuccessStatusCode)
                    {
                        responseContent = await response.Content.ReadAsAsync<ResponseModel>();
                    }
                }
                if (responseContent != null && responseContent.Success)
                {
                    var json = JsonConvert.SerializeObject(responseContent.Data);
                    var itemsResponseModel = JsonConvert.DeserializeObject<UserModel>(json);
                    //await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                    return Json(new { Success = responseContent.Success, Message = String.Join(" ", responseContent.Messages), Object = new { UserId = itemsResponseModel.Id != Guid.Empty ? itemsResponseModel.Id : itemsResponseModel.UserId } }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { Success = false, Message = String.Join(" ", responseContent.Messages) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, Message = "Something went wrong while user forgot password" }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(VerifyPhoneNumberCustomeModel model)
        {
            try
            {
                //if (!ModelState.IsValid)
                //{
                //    return Json(new { Success = false, Message = "Either UserId or Code is empty" }, JsonRequestBehavior.AllowGet);
                //}
                string actionPath = "User/RequestResetPasswordWithCode";
                ResponseModel responseContent = null;
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(CommonFunction.GetWebAPIBaseURL());
                    client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();

                    //client.BaseAddress = new Uri(path);
                    HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, model);
                    if (response.IsSuccessStatusCode)
                    {
                        responseContent = await response.Content.ReadAsAsync<ResponseModel>();
                    }
                }
                if (responseContent != null && responseContent.Success)
                {
                    //var json = JsonConvert.SerializeObject(responseContent.Data);
                    //var itemsResponseModel = JsonConvert.DeserializeObject<UserModel>(json);
                    var user = UserManager.FindById(model.UserId);
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                    return Json(new { Success = responseContent.Success, Message = String.Join(" ", responseContent.Messages), Object = new { model.UserId } }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { Success = false, Message = String.Join(" ", responseContent.Messages) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, Message = "Something went wrong while reseting password" }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResendCode(GetPhoneNumberCodeModel model)
        {
            try
            {
                //if (!ModelState.IsValid)
                //{
                //    return Json(new { Success = false, Message = "Either UserId or Code is empty" }, JsonRequestBehavior.AllowGet);
                //}
                string actionPath = "account/GetPhoneNumberCode";
                ResponseModel responseContent = null;
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(CommonFunction.GetWebAPIBaseURL());
                    client.DefaultRequestHeaders.Authorization = AuthHandler.AuthenticationHeader();

                    //client.BaseAddress = new Uri(path);
                    HttpResponseMessage response = await client.PostAsJsonAsync(actionPath, model);
                    if (response.IsSuccessStatusCode)
                    {
                        responseContent = await response.Content.ReadAsAsync<ResponseModel>();
                    }
                }
                if (responseContent != null && responseContent.Success)
                {
                    //var json = JsonConvert.SerializeObject(responseContent.Data);
                    //var itemsResponseModel = JsonConvert.DeserializeObject<UserModel>(json);
                    return Json(new { Success = responseContent.Success, Message = String.Join(" ", responseContent.Messages) }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { Success = false, Message = String.Join(" ", responseContent.Messages) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, Message = "Something went wrong while resending code on phone number" }, JsonRequestBehavior.AllowGet);
            }
        }
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return View("Error");
            }
            var result = await UserManager.ConfirmEmailAsync(userId, code);
            return View(result.Succeeded ? "ConfirmEmail" : "Error");
        }
        
        //
        // POST: /Account/ForgotPassword
        //[HttpPost]
        //[AllowAnonymous]
        //[ValidateAntiForgeryToken]
        //public async Task<ActionResult> ForgotPassword(ForgotPasswordViewModel model)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        var user = await UserManager.FindByNameAsync(model.Email);
        //        if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
        //        {
        //            // Don't reveal that the user does not exist or is not confirmed
        //            return View("ForgotPasswordConfirmation");
        //        }

        //        // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
        //        // Send an email with this link
        //        // string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
        //        // var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);		
        //        // await UserManager.SendEmailAsync(user.Id, "Reset Password", "Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>");
        //        // return RedirectToAction("ForgotPasswordConfirmation", "Account");
        //    }

        //    // If we got this far, something failed, redisplay form
        //    return View(model);
        //}

        //
        // GET: /Account/ForgotPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        //
        //// GET: /Account/ResetPassword
        //[AllowAnonymous]
        //public ActionResult ResetPassword(string code)
        //{
        //    return code == null ? View("Error") : View();
        //}

        ////
        //// POST: /Account/ResetPassword
        //[HttpPost]
        //[AllowAnonymous]
        //[ValidateAntiForgeryToken]
        //public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return View(model);
        //    }
        //    var user = await UserManager.FindByNameAsync(model.Email);
        //    if (user == null)
        //    {
        //        // Don't reveal that the user does not exist
        //        return RedirectToAction("ResetPasswordConfirmation", "Account");
        //    }
        //    var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
        //    if (result.Succeeded)
        //    {
        //        return RedirectToAction("ResetPasswordConfirmation", "Account");
        //    }
        //    AddErrors(result);
        //    return View();
        //}

        //
        // GET: /Account/ResetPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }

        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/SendCode
        [AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl, bool rememberMe)
        {
            var userId = await SignInManager.GetVerifiedUserIdAsync();
            if (userId == null)
            {
                return View("Error");
            }
            var userFactors = await UserManager.GetValidTwoFactorProvidersAsync(userId);
            var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
            return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/SendCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SendCode(SendCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            // Generate the token and send it
            if (!await SignInManager.SendTwoFactorCodeAsync(model.SelectedProvider))
            {
                return View("Error");
            }
            return RedirectToAction("VerifyCode", new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            // Sign in the user with this external login provider if the user already has a login
            var result = await SignInManager.ExternalSignInAsync(loginInfo, isPersistent: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = false });
                case SignInStatus.Failure:
                default:
                    // If the user does not have an account, then prompt the user to create an account
                    ViewBag.ReturnUrl = returnUrl;
                    ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                    return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Email = loginInfo.Email });
            }
        }

        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Manage");
            }

            if (ModelState.IsValid)
            {
                // Get the information about the user from the external login provider
                var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return View("ExternalLoginFailure");
                }
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await UserManager.AddLoginAsync(user.Id, info.Login);
                    if (result.Succeeded)
                    {
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                        return RedirectToLocal(returnUrl);
                    }
                }
                AddErrors(result);
            }

            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }

        //
        // POST: /Account/LogOff
        [HttpGet]
        //[ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return RedirectToAction("Index", "Delivery");
        }

        //
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }


        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        public string GeneratePhoneCodeApiMethod(string userId, string mobile)
        {
            var phoneCode = UserManager.GenerateChangePhoneNumberToken(userId, mobile);
            // mobile number 
            mobile = mobile.Substring(1).Replace("-", "");
            mobile = "92" + mobile;
            Services.Services.EmailService.SendSms(mobile, "Your verification code is : " + phoneCode);
            return phoneCode;
        }
        #endregion
    }
}