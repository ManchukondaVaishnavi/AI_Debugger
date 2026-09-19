export interface AnalysisResponse {
  isDebuggingIssue: boolean;
  errorType: string;
  rootCause: string;
  confidence: number;
  evidence: string[];
  possibleCauses: string[];
  possibleFixes?: string[];
  timestamp?: string;
}

export interface InputRequest {
  inputLog: string;
}

