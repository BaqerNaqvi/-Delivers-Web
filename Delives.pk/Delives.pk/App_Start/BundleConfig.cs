using System.Web;
using System.Web.Optimization;

namespace Delives.pk
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-2.2.4.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/common").Include(
                      "~/Scripts/common_scripts_min.js",
                      "~/Scripts/Shared/functions.js",
                      "~/Scripts/toastr.js",
                      "~/Scripts/functions.js",
                      "~/Scripts/video_header.js"));

            bundles.Add(new ScriptBundle("~/bundles/video_header").Include(
                      "~/Scripts/video_header.js"));

            bundles.Add(new ScriptBundle("~/bundles/delivery").Include(
                      "~/Scripts/Delivery/delivery-main.js"));
            bundles.Add(new ScriptBundle("~/bundles/list").Include(
                      "~/Scripts/cat_nav_mobile.js",
                      "~/Scripts/map.js",
                      "~/Scripts/infobox.js",
                      "~/Scripts/ion.rangeSlider.js",
                      "~/Scripts/List/list-main.js"));

            bundles.Add(new ScriptBundle("~/bundles/menu").Include(

                      "~/Scripts/Menu/menu-main.js"));


            bundles.Add(new ScriptBundle("~/bundles/cart").Include(

                      "~/Scripts/theia-sticky-sidebar.js",
                      "~/Scripts/Cart/cart-main.js"
                      ));

            bundles.Add(new ScriptBundle("~/bundles/cart-snapshot").Include(

                     "~/Scripts/theia-sticky-sidebar.js",
                     "~/Scripts/Cart/cart-snapshot.js"
                     ));

            bundles.Add(new ScriptBundle("~/bundles/order-summary").Include(
              "~/Scripts/Shared/order-summary.js"
                    ));


            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/base.css"));

            bundles.Add(new StyleBundle("~/Content/checkboxes").Include(
                      "~/Content/skins/square/grey.css",
                      "~/Content/ion.rangeSlider.css",
                      "~/Content/ion.rangeSlider.skinFlat.css"
                      ));

            bundles.Add(new StyleBundle("~/Content/menu").Include(
                      "~/Content/skins/square/grey.css"
                      ));
            bundles.Add(new StyleBundle("~/Content/cart").Include(
                     "~/Content/skins/square/grey.css"
                     ));

        }
    }
}
