using AIDebugger.Models;
using AIDebugger.Services;
using Microsoft.AspNetCore.Mvc;

namespace AIDebugger.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DebuggingController: ControllerBase
    {
        private readonly DebuggingService _debuggingService;
        public DebuggingController(DebuggingService debuggingService)
        {
            _debuggingService = debuggingService;
        }

        [HttpPost("InputLog")]
        public async Task<ActionResult<ResponseModel>> AnalyzeAndResponseController(InputRequest log)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(log.InputLog))
                {
                    return BadRequest("Logs cannot be empty");
                }
                var res = await _debuggingService.AnalyzeAndResponseAsync(log.InputLog);
                return Ok(res);
            }
            catch(Exception ex)
            {
                throw new Exception($"Exception: {ex.Message}");
            }
        } 
    }
}