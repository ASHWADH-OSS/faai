import React, { useState } from 'react';
import { Database, Search, ExternalLink, ShieldCheck, CheckCircle2, Filter } from 'lucide-react';
import { FinancialReport, FinancialMetricEvidence } from '../types/finance';

interface EvidenceLedgerProps {
  report: FinancialReport;
}

export const EvidenceLedger: React.FC<EvidenceLedgerProps> = ({ report }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Income Statement', 'Balance Sheet', 'Cash Flow', 'Market & Macro', 'Guidance'];

  const filteredEvidence = report.evidenceLedger.filter((ev) => {
    const matchesSearch =
      ev.metric.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || ev.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Forensic Evidence & Filing Audit Trail
          </span>
          <span className="text-slate-600 text-xs">·</span>
          <span className="text-xs text-slate-400">
            SEC EDGAR, 10-K, 10-Q & Market Yield Citations
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{report.evidenceLedger.length} Grounded Records Verified</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search metric, source filing, or excerpt..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700">
            <tr>
              <th className="p-3.5">Financial Metric</th>
              <th className="p-3.5 text-right">Extracted Value</th>
              <th className="p-3.5">Fiscal Period</th>
              <th className="p-3.5">Source Document & Item</th>
              <th className="p-3.5">Filing Excerpt Proof</th>
              <th className="p-3.5 text-center">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredEvidence.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No evidence records match your search filter.
                </td>
              </tr>
            ) : (
              filteredEvidence.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{ev.metric}</div>
                    <div className="text-[10px] text-blue-400 uppercase tracking-wide mt-0.5">{ev.category}</div>
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-blue-400 tabular-nums">
                    {ev.formattedValue}
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {ev.period}
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-slate-300">{ev.source}</div>
                    {ev.sourceUrl && (
                      <a
                        href={ev.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        Source Link <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </td>
                  <td className="p-3.5 max-w-sm">
                    <p className="text-slate-300 text-[11px] leading-relaxed italic bg-slate-950/60 p-2 rounded border border-slate-800">
                      "{ev.excerpt}"
                    </p>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">
                      <CheckCircle2 className="w-3 h-3" />
                      {ev.confidence}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Forensic Audit Note */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-slate-200">Autonomous Model Grounding Standard:</div>
          <p className="leading-relaxed">
            Every metric utilized by the DCF engine, DuPont decomposition, and solvency ratio matrix is tied directly to verified public disclosures. Numbers undergo cross-reconciliation with reported balance sheet identities to eliminate hallucinated inputs.
          </p>
        </div>
      </div>
    </div>
  );
};
