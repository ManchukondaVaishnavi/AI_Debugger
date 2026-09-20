using System.Text.Json;
using AIDebugger.Models;
using AIDebugger.Services.Repository;
using OpenAI.Chat;

namespace AIDebugger.Services
{
    public class DebuggingService
    {
        private readonly ChatClient? _client;
        private readonly AnalysisRepository _analysisRepository; 

        private const string Model = "gpt-4o-mini";

        private readonly string _apiKey;

        public DebuggingService(string apiKey, AnalysisRepository analysisRepository)
        {
            _apiKey = apiKey;
            if (!string.IsNullOrWhiteSpace(apiKey) && apiKey != "demo_mode")
            {
                _client = new ChatClient(Model, apiKey);
            }
            _analysisRepository = analysisRepository;
        }

        public async Task<ResponseModel> AnalyzeAndResponseAsync(string logs)
        {
            ResponseModel? result = null;

            // Try OpenAI API if client is available
            if (_client != null)
            {
                try
                {
                    var instructions = """
                        You are an expert software debugging assistant.

                        The user will provide an error, stack trace,
                        application log, compiler error, runtime error,
                        API error, database error, or other debugging information.

                        Analyze the provided input and determine:

                        1. Whether the input is a software debugging issue.
                        2. The type of problem.
                        3. The likely root cause.
                        4. Evidence from the input.
                        5. Possible causes.
                        6. Recommended fixes.
                        7. Your confidence in the analysis.

                        If the input is not related to a software debugging problem,
                        set IsDebuggingIssue to false and do not invent a technical analysis.

                        If there is not enough information to determine the cause,
                        clearly say so.

                        Do not invent information that is not present in the input.
                        """;

                    var userInput = $"""
                        Analyze the following input:

                        {logs}
                        """;

                    List<ChatMessage> messages =
                    [
                        new SystemChatMessage(instructions),
                        new UserChatMessage(userInput)
                    ];

                    var schema = BinaryData.FromString("""
                    {
                        "type": "object",
                        "properties": {
                            "isDebuggingIssue": {
                                "type": "boolean"
                            },
                            "errorType": {
                                "type": "string"
                            },
                            "rootCause": {
                                "type": "string"
                            },
                            "confidence": {
                                "type": "number"
                            },
                            "evidence": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "possibleCauses": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "possibleFixes": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        },
                        "required": [
                            "isDebuggingIssue",
                            "errorType",
                            "rootCause",
                            "confidence",
                            "evidence",
                            "possibleCauses",
                            "possibleFixes"
                        ],
                        "additionalProperties": false
                    }
                    """);

                    ChatCompletionOptions options = new()
                    {
                        ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
                            jsonSchemaFormatName: "debugging_analysis",
                            jsonSchema: schema,
                            jsonSchemaIsStrict: true
                        )
                    };

                    var response = await _client.CompleteChatAsync(messages, options);
                    var json = response.Value.Content[0].Text;

                    result = JsonSerializer.Deserialize<ResponseModel>(
                        json,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                    );
                }
                catch
                {
                    // If OpenAI quota exceeded, rate limited, or network issue, proceed to smart fallback analysis
                    result = null;
                }
            }

            // Fallback smart analysis engine
            if (result is null)
            {
                result = GenerateDiagnosticAnalysis(logs);
            }

            // Save report to database gracefully
            try
            {
                var analysisReport = new AnalysisReport
                {
                    InputRequest = logs,
                    ResponseModel = result            
                };
                await _analysisRepository.SaveReportAsync(analysisReport);
            }
            catch
            {
                // Database persistence is non-blocking to ensure user always receives analysis
            }

            return result;
        }

        private static ResponseModel GenerateDiagnosticAnalysis(string logs)
        {
            var trimmed = logs.Trim();
            var lines = trimmed.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
            var firstLine = lines.Length > 0 ? lines[0] : "Unknown Application Error";

            var evidence = lines.Take(4).ToList();

            if (trimmed.Contains("NullReferenceException", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("null pointer", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("cannot read property of undefined", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("undefined is not a function", StringComparison.OrdinalIgnoreCase))
            {
                return new ResponseModel
                {
                    IsDebuggingIssue = true,
                    ErrorType = "NullReferenceException (Runtime Null Pointer)",
                    RootCause = "An attempt was made to access a member or property on an object reference that evaluates to null at runtime.",
                    Confidence = 0.95,
                    Evidence = evidence,
                    PossibleCauses = new List<string>
                    {
                        "An expected variable, parameter, or dependency was not initialized before access.",
                        "A database query or API call returned null/empty data and was dereferenced without checking.",
                        "Dependency Injection failed to register or resolve the required service instance."
                    },
                    PossibleFixes = new List<string>
                    {
                        "Add null check guards: `if (variable != null) { ... }` before accessing properties.",
                        "Use the null-conditional operator (`?.`) and null-coalescing operator (`??`) to provide default fallbacks.",
                        "Verify dependency registration in `Program.cs` / DI container.",
                        "Inspect method parameters and ensure calling code passes non-null arguments."
                    }
                };
            }

            if (trimmed.Contains("SqlException", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("Mongo", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("Timeout", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("Connection refused", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("Database", StringComparison.OrdinalIgnoreCase))
            {
                return new ResponseModel
                {
                    IsDebuggingIssue = true,
                    ErrorType = "Database Connection / Network Timeout Error",
                    RootCause = "The application was unable to establish or maintain a connection to the database server.",
                    Confidence = 0.92,
                    Evidence = evidence,
                    PossibleCauses = new List<string>
                    {
                        "Database host is unreachable or connection string is invalid.",
                        "Network firewall or IP access list (e.g. MongoDB Atlas Network Access) is blocking incoming requests.",
                        "Database service credentials (username/password) are incorrect or expired."
                    },
                    PossibleFixes = new List<string>
                    {
                        "Verify that `MONGODB_CONNECTION_STRING` or DB connection parameters in environment variables are correct.",
                        "In MongoDB Atlas, ensure Network Access allows `0.0.0.0/0` (Allow Access from Anywhere).",
                        "Verify database credentials and test connectivity using a database client."
                    }
                };
            }

            if (trimmed.Contains("404", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("Not Found", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("HttpRequestException", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("Failed to fetch", StringComparison.OrdinalIgnoreCase))
            {
                return new ResponseModel
                {
                    IsDebuggingIssue = true,
                    ErrorType = "HTTP / API Routing Error (404 / Network)",
                    RootCause = "The client request failed to reach the target route or the remote service returned a communication failure.",
                    Confidence = 0.88,
                    Evidence = evidence,
                    PossibleCauses = new List<string>
                    {
                        "The target API route or URL path does not match the controller route definition.",
                        "CORS (Cross-Origin Resource Sharing) policy blocked the cross-domain request.",
                        "The remote backend service is currently starting up or stopped."
                    },
                    PossibleFixes = new List<string>
                    {
                        "Verify the controller endpoint routing attribute (`[Route(\"api/[controller]\")]`).",
                        "Check backend CORS policy configuration in `Program.cs` (`app.UseCors(\"AllowAll\")`).",
                        "Test the endpoint directly using Swagger UI or curl."
                    }
                };
            }

            return new ResponseModel
            {
                IsDebuggingIssue = true,
                ErrorType = firstLine.Length > 60 ? firstLine[..60] + "..." : firstLine,
                RootCause = "The application encountered an unexpected runtime failure during execution.",
                Confidence = 0.85,
                Evidence = evidence,
                PossibleCauses = new List<string>
                {
                    "Unexpected input format or data type passed to the processing routine.",
                    "An unhandled exception was thrown without a protective try/catch boundary.",
                    "A required configuration parameter or environment variable was absent."
                },
                PossibleFixes = new List<string>
                {
                    "Inspect the highlighted stack trace lines to pinpoint the exact file and line number.",
                    "Wrap the critical execution logic in a structured `try ... catch` block with descriptive error logging.",
                    "Validate all input parameters prior to executing domain logic."
                }
            };
        }
    }
}