using System.Text.Json;
using AIDebugger.Models;
using AIDebugger.Services.Repository;
using OpenAI.Chat;

namespace AIDebugger.Services
{
    public class DebuggingService
    {
        private readonly ChatClient _client;
        private readonly AnalysisRepository _analysisRepository; 

        private const string Model = "gpt-5.6-terra";

        public DebuggingService(string apiKey, AnalysisRepository analysisRepository)
        {
            _client = new ChatClient(Model, apiKey);
            _analysisRepository = analysisRepository;
        }

        public async Task<ResponseModel> AnalyzeAndResponseAsync(string logs)
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

            var response = await _client.CompleteChatAsync(
                messages,
                options
            );

            var json = response.Value.Content[0].Text;

            var result = JsonSerializer.Deserialize<ResponseModel>(
                json,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }
            );

            if (result is null)
            {
                throw new InvalidOperationException(
                    "The AI returned an invalid response."
                );
            }

            var analysisReport = new AnalysisReport
            {
                InputRequest = logs,
                ResponseModel = result            
            };

            await _analysisRepository.SaveReportAsync(analysisReport);

            return result;
        }
    }
}