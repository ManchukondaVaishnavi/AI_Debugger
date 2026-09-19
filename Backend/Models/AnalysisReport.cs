using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AIDebugger.Models
{
    public class AnalysisReport
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string InputRequest { get; set; } = null!;
        public ResponseModel ResponseModel { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}