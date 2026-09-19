namespace AIDebugger.Models
{
    public class ResponseModel
    {
        public required bool IsDebuggingIssue { get; set; }
        public string ErrorType  { get; set; } = string.Empty;
        public string RootCause { get; set; } = string.Empty;
        public required double Confidence { get; set; }
        public List<string> Evidence { get; set; } = [];
        public List<string> PossibleCauses { get; set; } = [];
        public List<string>? PossibleFixes { get; set; } = [];
    }
}