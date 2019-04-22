using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Delives.pk.Models
{
    public class UserInfo
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public string PhoneNumber { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public string UserName { get; set; }
        public DateTime CreationTime { get; set; }

        public string CNIC { get; set; }

        public bool Status { get; set; }

        public string ProfileImageUrl { get; set; }

        public string Address { get; set; }
        public string Cords { get; set; }
    }


    public class UserInfoInCartResponseModel
    {

        public UserInfo Data { get; set; }
        public string Success { get; set; }
        public List<string> Messages { get; set; }
    }

    public class UserInfoRequestModel
    {
        public string UserId { get; set; }
    }

    public class UpdateUserInfoRequestModel
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Cords { get; set; }
    }

    public class PlaceOrderResponseModel
    {
        public string Data { get; set; }
        public string Success { get; set; }
        public List<string> Messages { get; set; }
    }

    public class PlaceOrderRequestModelLocal
    {
        public List<ItemsInOrder> Items { get; set; }
        public string Address { get; set; }
        public string Instructions { get; set; }
        public string PaymentMethod { get; set; }
        public string Cords { get; set; }
    }

    public class ItemsInOrder
    {
        public int ItemId { get; set; }
        public int Quantity { get; set; }
        public int StoreId { get; set; }
    }


}