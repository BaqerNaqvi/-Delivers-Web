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
        public List<string> OrderId { get; set; }
        public string SerialNo { get; set; }
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
        public string OrderPlacedById { get; set; }  // for web only

    }

    public class ItemsInOrder
    {
        public int ItemId { get; set; }
        public int Quantity { get; set; }
        public int StoreId { get; set; }
    }

    public class OrderConfirmedResponseModel
    {
        public GetOrderBySerialNoResponse Data { get; set; }
        public string Success { get; set; }
        public List<string> Messages { get; set; }
    }

    public class GetOrderBySerialNoResponse
    {
        public int DeliveryTime { get; set; }

        public int DeliveryFee { get; set; }

        public List<OrderLocal> Orders { get; set; }
    }

    public class OrderConfirmedRequestModel
    {
        public string SerialNo { get; set; }
    }

    public class OrderLocal
    {
        public string Id { get; set; }
        public string DateTime { get; set; }
        public string Status { get; set; }
        public string Address { get; set; }
        public string OrderBy { get; set; }
        public int Amount { get; set; }
        public string EstimatedTime { get; set; }
        public string Instructions { get; set; }

        public string OrderByName { get; set; }
        public List<OrderDetailLocal> OrderDetails { get; set; }
        public List<OrderHistoryLocal> History { get; set; }
        public string SerialNo { get; set; }
        public string PickedBy { get; set; }
    }

    public class OrderDetailLocal
    {
        public long Id { get; set; }
        public long ItemId { get; set; }
        public int Quantity { get; set; }
        public long OrderId { get; set; }

        public virtual ItemDetailLocal ItemDetail { get; set; }
        public virtual OrderLocal Order { get; set; }
    }

    public class ItemDetailLocal
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public long ListItemId { get; set; }
        public string CreationDate { get; set; }
        public System.DateTime EditDate { get; set; }
        public string Image { get; set; }
        public bool Status { get; set; }

        public string Description { get; set; }

        public virtual ListItemLocal_Short_For_Cart ListItem { get; set; }

        public virtual List<RatingLocalForCartView> Reviewes { get; set; }
        public string Type { get; set; }


    }

    public class ListItemLocal_Short_For_Cart
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Address { get; set; }
        public string LogoImage { get; set; }
    }

    public class RatingLocalForCartView
    {
        public long Id { get; set; }
        public double RatingStar { get; set; }
        public string Comments { get; set; }
        public long RatedToItem { get; set; }
        public string RatedByUserName { get; set; }
        public string CreationDate { get; set; }
        public bool IsApproved { get; set; }
        public string ReviewedOnName { get; set; }
        public string RatedByUserId { get; set; }
    }

    public class OrderHistoryLocal
    {
        public long Id { get; set; }
        public long OrderId { get; set; }
        public string Status { get; set; }

        public System.DateTime DateTime { get; set; }

        public OrderLocal Order { get; set; }

        public bool IsCurrent { get; set; }

    }


}