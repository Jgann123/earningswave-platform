export interface EarningsData {
    ticker: string;
    companyName: string;
    date: Date;
    callTime?: string;
    epsEstimate?: number;
    epsActual?: number;
    revenueEstimate?: number;
    revenueActual?: number;
    transcriptUrl?: string;
  }
