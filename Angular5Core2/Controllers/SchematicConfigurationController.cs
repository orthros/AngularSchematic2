using Angular5Core2.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;


namespace Angular5Core2.Controllers
{

    [Route("api/[controller]")]
    public class SchematicConfigurationController : Controller
    {
        protected readonly DBEntities UserDB = new DBEntities();

        [HttpGet("[action]")]
        public IEnumerable<TblConfigObject> ConfigObjects()
        {
            return UserDB.TblConfigObject.AsEnumerable();
        }
        [HttpGet("[action]")]
        public IEnumerable<TblConfigObjectConnections> ConfigObjectConnections()
        {
            return UserDB.TblConfigObjectConnections.AsEnumerable();
        }
        [HttpGet("[action]")]
        public IEnumerable<TblSchematicPipeNodes> ConfigPipeNodes()
        {
            return UserDB.TblSchematicPipeNodes.AsEnumerable();
        }


    }

  
}
