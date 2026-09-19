# AI Debugger 🔍

An intelligent error analysis and debugging assistant that helps developers quickly diagnose and resolve application errors and stack traces.

## 🚀 Features

- **Automated Log Analysis**: Paste error logs, stack traces, or exception messages for instant diagnosis.
- **Root Cause Identification**: Understand the underlying problem with high-confidence explanations.
- **Evidence & Breakdown**: Detailed evidence extraction from logs pinpointing where and why the failure occurred.
- **Actionable Fixes**: Step-by-step recommended solutions and preventative measures.
- **Rate Limiting & Security**: Built-in API rate limiting and security protections.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Ant Design (`antd`)
- **Icons**: Lucide React

### Backend
- **Platform**: ASP.NET Core 9.0 Web API
- **AI Integration**: OpenAI API
- **Database**: MongoDB (via MongoDB.Driver)
- **API Documentation**: OpenAPI / Swagger UI
- **Containerization**: Docker

---

## 📂 Project Structure

```
├── Backend/               # ASP.NET Core 9.0 Web API
│   ├── Controllers/       # API Controllers (DebuggingController)
│   ├── Models/            # Request and Response models
│   ├── Services/          # Debugging service & OpenAI integration
│   ├── Data/              # MongoDB context and repositories
│   └── Dockerfile         # Docker build configuration
├── Frontend/              # React + Vite application
│   ├── src/
│   │   ├── components/    # UI components (Evidence, Fixes, Summary)
│   │   ├── pages/         # Debugger main page
│   │   ├── services/      # API communication layer
│   │   └── types/         # TypeScript definitions
│   └── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/)
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- OpenAI API Key

### Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. Set required environment variables:
   ```bash
   # Windows PowerShell
   $env:MONGODB_CONNECTION_STRING="your_mongodb_connection_string"
   $env:OPENAI_API_KEY="your_openai_api_key"
   ```

3. Run the backend API:
   ```bash
   dotnet run
   ```
   The API will be available at `http://localhost:5255` (Swagger UI at `/swagger`).

### Frontend Setup

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📄 License

This project is licensed under the MIT License.
