using Services.DbContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Models
{
    public class UserLocal
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public string PhoneNumber { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public string SecurityStamp { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public DateTime LockoutEndDateUtc { get; set; }
        public bool LockoutEnabled { get; set; }
        public int AccessFailedCount { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime EditTime { get; set; }
        public int Type { get; set; }
        public bool IsApproved { get; set; }

        public string CNIC { get; set; }

        public bool Status { get; set; }

        public string ProfileImageUrl { get; set; }

        public ListItemLocal Restaurant { get; set; }
    }

    public static class Usermapper
    {
        public static UserLocal Mapper(this AspNetUser user)
        {
            return new UserLocal
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email

            };
        }
    }
}
