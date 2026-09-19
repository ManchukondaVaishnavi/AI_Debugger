FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Ai_Debugger.csproj", "./"]
RUN dotnet restore "Ai_Debugger.csproj"

COPY . .
RUN dotnet publish "Ai_Debugger.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000

ENTRYPOINT ["dotnet", "Ai_Debugger.dll"]