using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Delives.pk.Models
{
    public class ItemViewModel
    {
        public int Id { get; set; }
        public int Type { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        //public string Location { get; set; }
        //public string LocationObj { get; set; }
        public string Phone { get; set; }
        public double Rating { get; set; }
        public string Address { get; set; }
        public string LogoImage { get; set; }
        public string Cords { get; set; }
        public string BgImage { get; set; }
        public bool Status { get; set; }
        public string CreationDate { get; set; }
        public string LastEdit { get; set; }
        public List<ReviewViewModel> Reviewes { get; set; }
        public double Distance { get; set; }
        public string Opens { get; set; }
        public string Closes { get; set; }
        public string MinOrder { get; set; }
        public bool IsFeatured { get; set; }
    }
    public class ItemTypeViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Status { get; set; }
        public DateTime CreationTime { get; set; }
        public int CatId { get; set; }
        public int ItemCount { get; set; }
    }
    public class ItemsResponseModel
    {
        public List<ItemViewModel> Items { get; set; }
        public int TotalItems { get; set; }
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
    }
    public class SearchResponseModel
    {
        public Object Data { get; set; }
        public string Success { get; set; }
        public List<string> Messages { get; set; }
    }
    public class ItemSearchModel
    {
        public int Type { get; set; }
        public List<int> TypeList { get; set; }
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int DistanceFrom { get; set; }
        public int DistanceTo { get; set; }
        public int Rating { get; set; }
        public string SearchTerm { get; set; }
        public string Cords { get; set; }
        public bool IsWeb { get; set; }
        public string SortOrder { get; set; }
        public string OrderBy { get; set; }
    }
    public class ReviewViewModel
    {
        public int Id { get; set; }
        public string RatingStar { get; set; }
        public string Comments { get; set; }
    }
}