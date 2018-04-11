﻿//using schematicv2.DBContext;
using Microsoft.AspNetCore.Mvc;


using System.Linq;
using System.Net.Http;


namespace Angular5Core2.Controllers
{
    [Produces("application/json")]
    [Route("api/schematicConfigurationConnections")]
    public class SchematicConfigurationConnectionsController : BaseAPIController
    {

        public HttpResponseMessage Get()
        {

            return ToJson(UserDB.TblConfigObjectConnections.AsEnumerable());


        }
    }
}