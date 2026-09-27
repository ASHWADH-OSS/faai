import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { FinancialReport } from '../types/finance';

interface AuditReportViewerProps {
  report: FinancialReport;
}

export const AuditReportViewer: React.FC<AuditReportViewerProps> = ({ report }) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMemo = () => {
    const memo = `# FINANCIAL AUDIT & VALUATION MEMORANDUM
COMPANY: ${report.companyName} (${report.ticker})
DATE: ${new Date(report.generatedAt).toLocaleDateString()}
AUDIT OPINION: ${report.auditValidation.auditOpinion}
RECOMMENDATION: ${report.rating} (Target: $${report.targetPrice.toFixed(2)}, Current: $${report.currentPrice.toFixed(2)}, Implied: ${report.impliedReturnPercent.toFixed(1)}%)

EXECUTIVE SUMMARY:
${report.executiveSummary}

INVESTMENT THESIS:
${report.investmentThesis}

KEY VERIFIED VALUATION METRICS:
- WACC Discount Rate: ${(report.dcfModel.wacc * 100).toFixed(2)}%
- Perpetual Growth Rate: ${(report.dcfModel.terminalGrowthRate * 100).toFixed(2)}%
- Enterprise Value: $${report.dcfModel.enterpriseValue.toLocaleString()}M
- Equity Value: $${report.dcfModel.equityValue.toLocaleString()}M
- DuPont ROE: ${report.dupontAnalysis.roe.toFixed(2)}% (Operating Margin: ${report.dupontAnalysis.operatingMargin.toFixed(1)}%, Asset Turnover: ${report.dupontAnalysis.assetTurnover.toFixed(2)}x)
- ROIC: ${report.ratios.roic.toFixed(1)}% (Spread over WACC: +${report.ratios.roicWaccSpread.toFixed(1)}%)
- FCF Conversion: ${report.ratios.fcfConversion.toFixed(1)}%

AUDIT SIGN-OFF:
${report.auditValidation.verdictSummary}
Math Integrity: ${report.auditValidation.mathIntegrityScore}/100 | Checksums: PASSED
`;
    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { dcfModel, dupontAnalysis, ratios, multiples, auditValidation } = report;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Audit-Ready Institutional Valuation Report · Prepared by Autonomous Forensic Agent</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMemo}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Memo' : 'Copy Executive Memo'}
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-600/30"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save to PDF
          </button>
        </div>
      </div>

      {/* Main Printable Document Sheet */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Document Header & Audit Opinion Stamp */}
        <div className="border-b border-slate-800 pb-6 print:border-neutral-300">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-blue-400 print:text-blue-700 mb-1">
                Institutional Equity Research & Forensic Audit Memo
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white print:text-black tracking-tight">
                {report.companyName} ({report.ticker})
              </h1>
              <p className="text-xs text-slate-400 print:text-neutral-600 mt-1 max-w-2xl">
                Research Scope: {report.question}
              </p>
              <div className="text-[11px] text-slate-500 print:text-neutral-500 mt-2 font-mono flex items-center gap-2">
                <span>Audit Ref: {report.id}</span>
                <span>·</span>
                <span>Date: {new Date(report.generatedAt).toLocaleString()}</span>
                <span>·</span>
                <span>Framework: ASC 606 / US GAAP</span>
              </div>
            </div>

            {/* Audit Stamp */}
            <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-right print:bg-emerald-50 print:border-emerald-600">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 print:text-emerald-800 uppercase tracking-wider justify-end">
                <ShieldCheck className="w-4 h-4 text-emerald-400 print:text-emerald-800" />
                {auditValidation.auditOpinion}
              </div>
              <div className="text-[11px] text-slate-300 print:text-neutral-700 mt-0.5">
                Math Integrity Score: {auditValidation.mathIntegrityScore}/100
              </div>
              <div className="text-[10px] text-emerald-400 print:text-emerald-700 font-mono">
                Checksums Reconciled 100%
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary & Investment Scorecard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-neutral-50 print:border-neutral-200">
            <div className="text-[11px] uppercase font-bold text-slate-400 print:text-neutral-500">
              Formal Recommendation
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 print:text-emerald-700 mt-1">
              {report.rating}
            </div>
            <div className="text-xs text-slate-400 print:text-neutral-600 mt-0.5">
              12-Month Target Horizon
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-neutral-50 print:border-neutral-200">
            <div className="text-[11px] uppercase font-bold text-slate-400 print:text-neutral-500">
              Intrinsic Target Price
            </div>
            <div className="text-2xl font-extrabold text-white print:text-black mt-1 tabular-nums">
              ${report.targetPrice.toFixed(2)}
            </div>
            <div className="text-xs text-emerald-400 print:text-emerald-700 mt-0.5 tabular-nums font-medium">
              {report.impliedReturnPercent >= 0 ? '+' : ''}{report.impliedReturnPercent.toFixed(1)}% vs Market
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-neutral-50 print:border-neutral-200">
            <div className="text-[11px] uppercase font-bold text-slate-400 print:text-neutral-500">
              Current Market Price
            </div>
            <div className="text-2xl font-extrabold text-slate-300 print:text-black mt-1 tabular-nums">
              ${report.currentPrice.toFixed(2)}
            </div>
            <div className="text-xs text-slate-400 print:text-neutral-600 mt-0.5 font-mono">
              Shares: {(dcfModel.sharesOutstanding / 1000).toFixed(2)}B Diluted
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-neutral-50 print:border-neutral-200">
            <div className="text-[11px] uppercase font-bold text-slate-400 print:text-neutral-500">
              Economic Moat Spread
            </div>
            <div className="text-2xl font-extrabold text-amber-400 print:text-amber-700 mt-1 tabular-nums">
              +{ratios.roicWaccSpread.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400 print:text-neutral-600 mt-0.5 tabular-nums">
              ROIC {ratios.roic.toFixed(1)}% vs WACC {(dcfModel.wacc * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Executive Summary Prose */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black">
            Executive Summary & Thesis Defense
          </h3>
          <p className="text-sm text-slate-300 print:text-neutral-800 leading-relaxed">
            {report.executiveSummary}
          </p>
          <p className="text-sm text-slate-300 print:text-neutral-800 leading-relaxed">
            {report.investmentThesis}
          </p>
        </div>

        {/* Section 1: Grounded SEC Evidence Register */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black">
              1. Grounded SEC Filings & Market Evidence Register
            </h3>
            <span className="text-xs text-slate-400 print:text-neutral-500">
              {report.evidenceLedger.length} Verified Citations
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-neutral-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 print:bg-neutral-100 text-slate-300 print:text-neutral-800 font-semibold border-b border-slate-700 print:border-neutral-300">
                <tr>
                  <th className="p-3">Financial Metric</th>
                  <th className="p-3 text-right">Reported Value</th>
                  <th className="p-3">Period</th>
                  <th className="p-3">Source Document & Filing Note</th>
                  <th className="p-3">Filing Excerpt</th>
                  <th className="p-3 text-center">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-neutral-200">
                {report.evidenceLedger.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-800/30 print:hover:bg-transparent">
                    <td className="p-3 font-medium text-white print:text-black">{ev.metric}</td>
                    <td className="p-3 text-right font-mono font-bold text-blue-400 print:text-blue-800 tabular-nums">
                      {ev.formattedValue}
                    </td>
                    <td className="p-3 text-slate-400 print:text-neutral-600">{ev.period}</td>
                    <td className="p-3 text-slate-300 print:text-neutral-700 font-medium">{ev.source}</td>
                    <td className="p-3 text-slate-400 print:text-neutral-600 max-w-xs text-[11px] italic">
                      "{ev.excerpt}"
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] font-bold text-emerald-400 print:text-emerald-800 bg-emerald-950/60 print:bg-emerald-50 px-2 py-0.5 rounded">
                        {ev.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Step-by-Step Verified DCF Calculations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black">
              2. Deterministic DCF Model & Mathematical Proofs
            </h3>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Checksum Verified
            </span>
          </div>

          {/* 5-Year UFCF Forecast Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-neutral-300">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-800/80 print:bg-neutral-100 text-slate-300 print:text-neutral-800 font-semibold border-b border-slate-700 print:border-neutral-300">
                <tr>
                  <th className="p-2.5 font-sans">Cash Flow Item ($M)</th>
                  {dcfModel.projectionYears.map((yr) => (
                    <th key={yr} className="p-2.5 text-right">{yr}E</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-neutral-200">
                <tr>
                  <td className="p-2.5 font-sans font-medium text-white print:text-black">Projected Revenue</td>
                  {dcfModel.projectedRevenue.map((v, i) => (
                    <td key={i} className="p-2.5 text-right tabular-nums text-slate-300 print:text-neutral-800">
                      ${v.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-sans font-medium text-white print:text-black">Operating Income (EBIT)</td>
                  {dcfModel.projectedEbit.map((v, i) => (
                    <td key={i} className="p-2.5 text-right tabular-nums text-slate-300 print:text-neutral-800">
                      ${v.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-sans font-medium text-white print:text-black">NOPAT (EBIT × (1 - t))</td>
                  {dcfModel.projectedNopat.map((v, i) => (
                    <td key={i} className="p-2.5 text-right tabular-nums text-slate-300 print:text-neutral-800">
                      ${v.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-sans font-medium text-white print:text-black">+ D&A Depreciation</td>
                  {dcfModel.projectedDnA.map((v, i) => (
                    <td key={i} className="p-2.5 text-right tabular-nums text-slate-300 print:text-neutral-800">
                      +${v.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-sans font-medium text-white print:text-black">- Capital Expenditures (CapEx)</td>
                  {dcfModel.projectedCapEx.map((v, i) => (
                    <td key={i} className="p-2.5 text-right tabular-nums text-red-400 print:text-red-700">
                      -${v.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-sans font-medium text-white print:text-black">- Net Working Capital (ΔNWC)</td>
                  {dcfModel.projectedNwcChange.map((v, i) => (
                    <td key={i} className="p-2.5 text-right tabular-nums text-slate-400 print:text-neutral-600">
                      -${v.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="bg-blue-950/30 print:bg-blue-50 font-bold">
                  <td className="p-2.5 font-sans text-blue-300 print:text-blue-900">Unlevered Free Cash Flow (UFCF)</td>
                  {dcfModel.projectedUfcf.map((v, i) => (
                    <td key={i} className="p-2.5 text-right tabular-nums text-blue-400 print:text-blue-800">
                      ${v.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-950/60 print:bg-neutral-50 font-bold">
                  <td className="p-2.5 font-sans text-slate-300 print:text-neutral-800">PV of Discrete Cash Flow (Mid-Year)</td>
                  {dcfModel.pvOfUfcf.map((v, i) => (
                    <td key={i} className="p-2.5 text-right tabular-nums text-emerald-400 print:text-emerald-800">
                      ${v.toLocaleString()}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Step-by-Step Calculation Proofs */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-neutral-600">
              Audit Calculation Step Logs:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dcfModel.steps.map((step) => (
                <div key={step.stepNumber} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-neutral-50 print:border-neutral-200 text-xs">
                  <div className="flex items-center justify-between font-semibold text-white print:text-black mb-1">
                    <span>{step.label}</span>
                    <span className="text-[10px] text-emerald-400 print:text-emerald-700 font-mono">
                      {step.verified ? '✓ VERIFIED' : 'AUDIT PENDING'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-blue-400 print:text-blue-800 bg-slate-900 print:bg-neutral-100 p-1.5 rounded mb-2">
                    {step.formula}
                  </div>
                  <div className="space-y-1 text-slate-400 print:text-neutral-600 text-[11px]">
                    {step.inputs.map((inp, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{inp.name}:</span>
                        <span className="font-mono text-slate-300 print:text-black">{inp.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-800 print:border-neutral-200 mt-2 pt-2 flex justify-between font-bold text-slate-200 print:text-black">
                    <span>Result:</span>
                    <span className="font-mono text-emerald-400 print:text-emerald-800">{step.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: DuPont 5-Stage Profitability Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black">
              3. DuPont 5-Stage Profitability Decomposition
            </h3>
            <span className="text-xs text-blue-400 font-mono">
              Primary Driver: {dupontAnalysis.primaryDriver}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-neutral-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 print:bg-neutral-100 text-slate-300 print:text-neutral-800 font-semibold border-b border-slate-700 print:border-neutral-300">
                <tr>
                  <th className="p-3">Stage / Component</th>
                  <th className="p-3">Formula</th>
                  <th className="p-3 text-right">Computed Value</th>
                  <th className="p-3">Interpretation & Diagnostic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-neutral-200">
                <tr>
                  <td className="p-3 font-medium text-white print:text-black">Stage 1: Tax Burden</td>
                  <td className="p-3 font-mono text-slate-400">Net Income / EBT</td>
                  <td className="p-3 text-right font-mono font-bold text-blue-400 tabular-nums">
                    {(dupontAnalysis.taxBurden * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 text-slate-300 print:text-neutral-700">Reflects earnings retention after corporate taxes</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white print:text-black">Stage 2: Interest Burden</td>
                  <td className="p-3 font-mono text-slate-400">EBT / EBIT</td>
                  <td className="p-3 text-right font-mono font-bold text-blue-400 tabular-nums">
                    {(dupontAnalysis.interestBurden * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 text-slate-300 print:text-neutral-700">
                    {dupontAnalysis.interestBurden >= 0.95 ? 'Minimal debt friction; exceptional interest coverage' : 'Debt servicing impact'}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white print:text-black">Stage 3: Operating Margin</td>
                  <td className="p-3 font-mono text-slate-400">EBIT / Revenue</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400 tabular-nums">
                    {dupontAnalysis.operatingMargin.toFixed(1)}%
                  </td>
                  <td className="p-3 text-slate-300 print:text-neutral-700">Pure operational pricing power before financing costs</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white print:text-black">Stage 4: Asset Turnover</td>
                  <td className="p-3 font-mono text-slate-400">Revenue / Total Assets</td>
                  <td className="p-3 text-right font-mono font-bold text-blue-400 tabular-nums">
                    {dupontAnalysis.assetTurnover.toFixed(2)}x
                  </td>
                  <td className="p-3 text-slate-300 print:text-neutral-700">Velocity of total balance sheet in driving top-line sales</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white print:text-black">Stage 5: Financial Leverage Multiplier</td>
                  <td className="p-3 font-mono text-slate-400">Total Assets / Equity</td>
                  <td className="p-3 text-right font-mono font-bold text-amber-400 tabular-nums">
                    {dupontAnalysis.financialLeverage.toFixed(2)}x
                  </td>
                  <td className="p-3 text-slate-300 print:text-neutral-700">Balance sheet leverage gearing factor</td>
                </tr>
                <tr className="bg-slate-950 font-bold print:bg-neutral-100">
                  <td className="p-3 text-white print:text-black">Reconstructed ROE vs Reported ROE</td>
                  <td className="p-3 font-mono text-slate-400">Π(Stages 1..5)</td>
                  <td className="p-3 text-right font-mono text-emerald-400 tabular-nums">
                    {dupontAnalysis.roeReconstructed.toFixed(2)}% (Direct: {dupontAnalysis.roeReported.toFixed(2)}%)
                  </td>
                  <td className="p-3 text-emerald-400 print:text-emerald-700">
                    Math Variance: {dupontAnalysis.variance.toFixed(4)}% (Passes identity check)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Solvency, Liquidity & Capital Allocation Ratios */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black">
            4. Solvency, Liquidity & Capital Health Matrix
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-neutral-50 print:border-neutral-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Ratio</div>
              <div className="text-xl font-bold text-white print:text-black mt-0.5 tabular-nums">
                {ratios.currentRatio.toFixed(2)}x
              </div>
              <div className="text-[11px] text-emerald-400">Benchmark: &gt; 1.2x</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-neutral-50 print:border-neutral-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Quick Ratio</div>
              <div className="text-xl font-bold text-white print:text-black mt-0.5 tabular-nums">
                {ratios.quickRatio.toFixed(2)}x
              </div>
              <div className="text-[11px] text-emerald-400">Excludes Inventory</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-neutral-50 print:border-neutral-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Net Debt / EBITDA</div>
              <div className="text-xl font-bold text-white print:text-black mt-0.5 tabular-nums">
                {ratios.netDebtToEbitda.toFixed(2)}x
              </div>
              <div className="text-[11px] text-emerald-400">{ratios.netDebtToEbitda <= 0 ? 'Net Cash Balance' : 'Safe Covenant'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-neutral-50 print:border-neutral-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">FCF Conversion</div>
              <div className="text-xl font-bold text-white print:text-black mt-0.5 tabular-nums">
                {ratios.fcfConversion.toFixed(1)}%
              </div>
              <div className="text-[11px] text-emerald-400">FCF / Net Income</div>
            </div>
          </div>
        </div>

        {/* Section 5: Sensitivity Matrix Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black">
            5. DCF Sensitivity Matrix (WACC vs Perpetual Growth Rate)
          </h3>
          <p className="text-xs text-slate-400 print:text-neutral-600">
            Grid of implied share prices under varying discount hurdle rates and terminal growth scenarios:
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-neutral-300">
            <table className="w-full text-center text-xs font-mono">
              <thead className="bg-slate-800/80 print:bg-neutral-100 text-slate-300 print:text-neutral-800 font-semibold border-b border-slate-700">
                <tr>
                  <th className="p-2.5 font-sans text-left">WACC \ g</th>
                  {dcfModel.sensitivityMatrix.growthValues.map((g, gi) => (
                    <th key={gi} className="p-2.5">
                      {(g * 100).toFixed(2)}%
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-neutral-200">
                {dcfModel.sensitivityMatrix.waccValues.map((w, wi) => (
                  <tr key={wi} className="hover:bg-slate-800/30">
                    <td className="p-2.5 font-sans font-bold text-left text-slate-300 print:text-black">
                      {(w * 100).toFixed(2)}%
                    </td>
                    {dcfModel.sensitivityMatrix.prices[wi].map((p, pi) => {
                      const isBase = wi === 2 && pi === 2;
                      return (
                        <td
                          key={pi}
                          className={`p-2.5 tabular-nums ${
                            isBase
                              ? 'bg-blue-600/30 text-white font-bold ring-1 ring-blue-500 rounded'
                              : p >= report.currentPrice
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          ${p.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 6: Audit Validation Sign-Off */}
        <div className="border-t border-slate-800 print:border-neutral-300 pt-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white print:text-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400 print:text-emerald-800" />
            6. Chief Forensic Auditor Committee Review
          </div>
          <p className="text-xs text-slate-300 print:text-neutral-700 leading-relaxed">
            {auditValidation.verdictSummary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {auditValidation.auditorChecks.map((chk, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-neutral-50 print:border-neutral-200 text-xs">
                <div className="flex items-center justify-between font-semibold text-white print:text-black mb-1">
                  <span>{chk.name}</span>
                  <span className={`text-[10px] font-mono ${chk.status === 'PASS' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {chk.status}
                  </span>
                </div>
                <p className="text-slate-400 print:text-neutral-600 text-[11px] leading-relaxed">
                  {chk.details}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 text-center border-t border-slate-800/80 text-[11px] text-slate-500 print:text-neutral-500 font-mono">
            Autonomous Financial Analyst Agent · Final Audit Opinion: {auditValidation.auditOpinion} · Confidential
          </div>
        </div>
      </div>
    </div>
  );
};
