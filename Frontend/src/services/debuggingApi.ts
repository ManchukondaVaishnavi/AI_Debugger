import type { AnalysisResponse } from '../types/debugging';

const API_URL = 'https://ai-debugger-czb5.onrender.com/api/Debugging/InputLog';

export class ApiError extends Error {
  status?: number;
  isRateLimit?: boolean;

  constructor(message: string, status?: number, isRateLimit?: boolean) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isRateLimit = isRateLimit;
  }
}

export const analyzeLogApi = async (inputLog: string): Promise<AnalysisResponse> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputLog }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new ApiError(
        'Rate limit reached: Too many requests sent in a short period. Please wait a minute before analyzing again.',
        429,
        true
      );
    }
    const errorText = await response.text();
    throw new ApiError(errorText || `Error ${response.status}: Failed to analyze logs`, response.status);
  }

  const data = await response.json();
  
  // Normalize casing if backend returns PascalCase
  const normalized: AnalysisResponse = {
    isDebuggingIssue: data.isDebuggingIssue ?? data.IsDebuggingIssue ?? false,
    errorType: data.errorType ?? data.ErrorType ?? 'Unknown Error',
    rootCause: data.rootCause ?? data.RootCause ?? 'No root cause identified',
    confidence: data.confidence ?? data.Confidence ?? 0,
    evidence: data.evidence ?? data.Evidence ?? [],
    possibleCauses: data.possibleCauses ?? data.PossibleCauses ?? [],
    possibleFixes: data.possibleFixes ?? data.PossibleFixes ?? data.possible_fixes ?? [],
    timestamp: new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  };

  return normalized;
};
