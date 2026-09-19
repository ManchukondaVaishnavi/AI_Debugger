using System.Threading.RateLimiting;
using AIDebugger.Context;
using AIDebugger.Models;
using AIDebugger.Services;
using AIDebugger.Services.Repository;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto;

    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddSingleton<MongoDbContext>(sp =>
{
    var connectionString =
        Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException(
            "MONGODB_CONNECTION_STRING is not configured.");
    }

    return new MongoDbContext(connectionString, "AiDebugger");
});

builder.Services.AddScoped<AnalysisRepository>();

builder.Services.AddScoped<DebuggingService>(sp =>
{
    var apiKey =
        Environment.GetEnvironmentVariable("OPENAI_API_KEY");

    if (string.IsNullOrWhiteSpace(apiKey))
    {
        throw new InvalidOperationException(
            "OPENAI_API_KEY is not configured.");
    }

    var repository =
        sp.GetRequiredService<AnalysisRepository>();

    return new DebuggingService(apiKey, repository);
});

builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter =
        PartitionedRateLimiter.Create<HttpContext, string>(
            httpContext =>
            {
                var ipAddress =
                    httpContext.Connection.RemoteIpAddress?.ToString()
                    ?? "unknown";

                return RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: ipAddress,
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 10,
                        Window = TimeSpan.FromMinutes(1),
                        QueueLimit = 0
                    });
            });

    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

var app = builder.Build();

app.MapOpenApi();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint(
        "/openapi/v1.json",
        "AI Debugger API");
});

app.UseForwardedHeaders();

app.UseCors("AllowAll");

app.UseRateLimiter();

app.MapControllers();

app.Run();