using AIDebugger.Models;
using MongoDB.Driver;

namespace AIDebugger.Context
{
    public class MongoDbContext
    {
        public IMongoCollection<AnalysisReport> AnalysisCollection { get; }
        public MongoDbContext(string connectionString, string databaseName)
        {
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);

            AnalysisCollection = database.GetCollection<AnalysisReport>("analysis");
        }
    }
}