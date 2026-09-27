export interface FinancialMetricEvidence {
  id: string;
  metric: string;
  value: number | string;
  formattedValue: string;
  period: string; // e.g., "FY2024", "Q3 2024", "TTM"
  source: string; // e.g., "SEC Form 10-K (Item 8)", "Consensus Estimates", "Treasury.gov"
  sourceUrl?: string;
  filingDate?: string;
  excerpt: string;
  confidence: 'High' | 'Medium' | 'Estimated';
  category: 'Income Statement' | 'Balance Sheet' | 'Cash Flow' | 'Market & Macro' | 'Guidance';
}

export interface CalculationStep {
  stepNumber: number;
  label: string;
  formula: string;
  inputs: { name: string; value: string; sourceId?: string }[];
  result: string;
  numericResult: number;
  verified: boolean;
  notes?: string;
}

export interface DCFModelResult {
  currentPrice: number;
  impliedPrice: number;
  upsideDownsidePercent: number;
  enterpriseValue: number;
  equityValue: number;
  netDebt: number;
  sharesOutstanding: number;
  wacc: number;
  terminalGrowthRate: number;
  costOfEquity: number;
  costOfDebt: number;
  taxRate: number;
  beta: number;
  riskFreeRate: number;
  equityRiskPremium: number;
  projectionYears: number[];
  projectedRevenue: number[];
  projectedEbit: number[];
  projectedNopat: number[];
  projectedDnA: number[];
  projectedCapEx: number[];
  projectedNwcChange: number[];
  projectedUfcf: number[];
  pvOfUfcf: number[];
  terminalValue: number;
  pvOfTerminalValue: number;
  sensitivityMatrix: {
    waccValues: number[];
    growthValues: number[];
    prices: number[][]; // grid of implied share prices
  };
  steps: CalculationStep[];
}

export interface DuPontAnalysisResult {
  roe: number;
  taxBurden: number; // Net Income / EBT
  interestBurden: number; // EBT / EBIT
  operatingMargin: number; // EBIT / Revenue
  assetTurnover: number; // Revenue / Total Assets
  financialLeverage: number; // Total Assets / Shareholders Equity
  roeReported: number;
  roeReconstructed: number;
  variance: number;
  priorYearRoe?: number;
  primaryDriver: string;
  steps: CalculationStep[];
}

export interface FinancialRatiosResult {
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  fcfConversion: number; // FCF / Net Income
  netDebtToEbitda: number;
  interestCoverage: number;
  roic: number;
  roicWaccSpread: number;
  daysSalesOutstanding?: number;
  daysInventoryOutstanding?: number;
  daysPayablesOutstanding?: number;
  cashConversionCycle?: number;
  steps: CalculationStep[];
}

export interface ValuationMultiplesResult {
  evToEbitda: number;
  evToSales: number;
  priceToEarnings: number;
  priceToFcf: number;
  pegRatio: number;
  peerComparisons: {
    peerName: string;
    ticker: string;
    evToEbitda: number;
    peRatio: number;
    fcfYield: number;
  }[];
}

export interface AuditValidation {
  auditOpinion: 'UNQUALIFIED (CLEAN)' | 'QUALIFIED' | 'EMPHASIS OF MATTER';
  verdictSummary: string;
  mathIntegrityScore: number; // 0-100
  evidenceCoverageScore: number; // 0-100
  stressTestVerdict: 'Passed' | 'Caution' | 'Vulnerable';
  checksumsPassed: boolean;
  auditorChecks: {
    name: string;
    status: 'PASS' | 'WARN' | 'FAIL';
    details: string;
  }[];
  keyAssumptionsTested: {
    assumption: string;
    baseValue: string;
    stressThreshold: string;
    impact: string;
  }[];
  governanceAndAccountingFlags: string[];
}

export interface SlideContent {
  slideNumber: number;
  title: string;
  subtitle: string;
  layout: 'title' | 'executive_summary' | 'valuation_dcf' | 'financial_health' | 'dupont_deep_dive' | 'risk_matrix' | 'recommendation';
  bulletPoints: string[];
  kpiCards?: { label: string; value: string; change?: string; context?: string }[];
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
  keyTakeaway: string;
  speakerNotes: string;
}

export interface PresentationDeck {
  deckTitle: string;
  deckSubtitle: string;
  targetCompany: string;
  ticker?: string;
  preparedFor: string;
  preparedBy: string;
  date: string;
  slides: SlideContent[];
}

export interface FinancialReport {
  id: string;
  question: string;
  companyName: string;
  ticker: string;
  generatedAt: string;
  executiveSummary: string;
  investmentThesis: string;
  rating: 'STRONG BUY' | 'OVERWEIGHT' | 'NEUTRAL' | 'UNDERWEIGHT' | 'SELL';
  targetPrice: number;
  currentPrice: number;
  impliedReturnPercent: number;
  researchPlan: string[];
  evidenceLedger: FinancialMetricEvidence[];
  dcfModel: DCFModelResult;
  dupontAnalysis: DuPontAnalysisResult;
  ratios: FinancialRatiosResult;
  multiples: ValuationMultiplesResult;
  auditValidation: AuditValidation;
  risksAndMitigants: { risk: string; severity: 'High' | 'Medium' | 'Low'; mitigant: string }[];
  presentationDeck: PresentationDeck;
}

export interface ResearchRequest {
  question: string;
  ticker?: string;
  companyName?: string;
  valuationType?: 'DCF_AND_MULTIPLES' | 'DUPONT_AND_MARGINS' | 'SOLVENCY_AND_STRESS' | 'COMPREHENSIVE';
  targetAudience?: 'BOARD_OF_DIRECTORS' | 'INVESTMENT_COMMITTEE' | 'CFO_EXECUTIVE' | 'AUDIT_COMMITTEE';
  customData?: string;
}
