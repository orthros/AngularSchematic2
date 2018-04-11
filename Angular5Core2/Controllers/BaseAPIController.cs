
using Microsoft.AspNetCore.Mvc;
using Angular5Core2.Controllers;
using System.Linq;
using System.Net.Http;
using System.Net;
using Newtonsoft.Json;
using System.Text;
using Angular5Core2.Models;

namespace Angular5Core2.Controllers
{
    public class BaseAPIController : Controller
    {
       protected readonly DBEntities UserDB = new DBEntities();
        protected HttpResponseMessage ToJson(dynamic obj)
        {
            var response = new HttpResponseMessage(HttpStatusCode.OK);

            response.Content = new StringContent(JsonConvert.SerializeObject(obj), Encoding.UTF8, "application/json");
            return response;
        }
        
    }
}