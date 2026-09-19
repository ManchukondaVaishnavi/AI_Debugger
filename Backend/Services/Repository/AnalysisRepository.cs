using AIDebugger.Context;
using AIDebugger.Models;

namespace AIDebugger.Services.Repository
{
    public class AnalysisRepository
    {
        private readonly MongoDbContext _context;
        public AnalysisRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task SaveReportAsync(AnalysisReport analysisReport)
        {
            await _context.AnalysisCollection.InsertOneAsync(analysisReport);
        }
    }
}