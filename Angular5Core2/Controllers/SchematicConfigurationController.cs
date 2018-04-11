using Angular5Core2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Angular5Core2.Controllers
{
    [Route("api/[controller]")]
    public class SchematicConfigurationController : Controller
    {
        protected DBEntities UserDB { get; }
        protected ILogger Logger { get; }

        public SchematicConfigurationController(DBEntities dB, ILogger<SchematicConfigurationController> logger)
        {
            Logger = logger ?? throw new ArgumentNullException(nameof(logger));
            UserDB = dB ?? throw new ArgumentNullException(nameof(dB));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> ConfigObjects()
        {
            try
            {
                var data = await UserDB.TblConfigObject.ToListAsync();
                if (data != null)
                {
                    return Ok(data);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception e)
            {
                Logger.LogError(e, "Hit an exception");
            }
            return BadRequest();
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> ConfigObjectConnections()
        {
            try
            {
                var data = await UserDB.TblConfigObjectConnections.ToListAsync();
                if (data != null)
                {
                    return Ok(data);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception e)
            {
                Logger.LogError(e, "Hit an exception");
            }
            return BadRequest();
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> ConfigPipeNodes()
        {
            try
            {
                var data = await UserDB.TblSchematicPipeNodes.ToListAsync();
                if (data != null)
                {
                    return Ok(data);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception e)
            {
                Logger.LogError(e, "Hit an exception");
            }
            return BadRequest();
        }
    }
}
