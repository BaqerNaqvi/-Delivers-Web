using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Delives.pk.Utilities
{
    public class CommonFunction
    {
        public static string GetWebAPIBaseURL()
        {
            string webAPIbaseURL = ConfigurationManager.AppSettings["webAPIbaseURL"];
            if (string.IsNullOrWhiteSpace(webAPIbaseURL))
                webAPIbaseURL = "http://www.delivers.pk/api/";
            return webAPIbaseURL;
        }
    }
}