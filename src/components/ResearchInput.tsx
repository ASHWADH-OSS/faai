import React, { useState } from 'react';
import { Search, Sparkles, FileSpreadsheet, Building2, HelpCircle } from 'lucide-react';
import { ResearchRequest } from '../types/finance';

interface ResearchInputProps {
  onSubmit: (request: ResearchRequest) => void;
  isResearching: boolean;
}

const PRESET_QUERIES = [
  {
    ticker: 'NVDA',
    company: 'NVIDIA Corporation',
    question: 'Is NVIDIA\'s current market valuation justified by long-term hyperscaler AI CapEx and GPU gross margin sustainability?',
    type: 'COMPREHENSIVE' as const,
  },
  {
    ticker: 'AAPL',
    company: 'Apple Inc.',
    question: 'Evaluate Apple\'s capital allocation strategy, Services gross margin expansion, and DCF intrinsic price sensitivity.',
    type: 'DCF_AND_MULTIPLES' as const,
  },
  {
    ticker: 'MSFT',
    company: 'Microsoft Corporation',
    question: 'Perform a 5-stage DuPont decomposition of Microsoft to evaluate cloud profitability and AI infrastructure CapEx return on invested capital.',
    type: 'DUPONT_AND_MARGINS' as const,
  },
];

export const ResearchInput: React.FC<ResearchInputProps> = ({ onSubmit, isResearching }) => {
  const [ticker, setTicker] = useState('NVDA');
  const [question, setQuestion] = useState(PRESET_QUERIES[0].question);
  const [targetAudience, setTargetAudience] = useState<'BOARD_OF_DIRECTORS' | 'INVESTMENT_COMMITTEE' | 'CFO_EXECUTIVE' | 'AUDIT_COMMITTEE'>('BOARD_OF_DIRECTORS');
  const [valuationType, setValuationType] = useState<'COMPREHENSIVE' | 'DCF_AND_MULTIPLES' | 'DUPONT_AND_MARGINS' | 'SOLVENCY_AND_STRESS'>('COMPREHENSIVE');
  const [showCustomData, setShowCustomData] = useState(false);
  const [customData, setCustomData] = useState('');

  const handleSelectPreset = (preset: typeof PRESET_QUERIES[0]) => {
    setTicker(preset.ticker);
    setQuestion(preset.question);
    setValuationType(preset.type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onSubmit({
      question,
      ticker: ticker.trim().toUpperCase(),
      valuationType,
      targetAudience,
      customData: showCustomData ? customData : undefined,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto shadow-xl shadow-black/40">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 tracking-wider uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          Autonomous Financial Investigation Engine
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Formulate Financial Question & Target Entity
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Enter any public company or upload custom statements. The agent autonomously retrieves grounded SEC 10-K/10-Q evidence, runs deterministic DCF & DuPont math, verifies checksums, and compiles a board-ready deck.
        </p>
      </div>

      {/* Preset Queries */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-slate-400 mb-2">
          Recommended Case Studies & Inquiries
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {PRESET_QUERIES.map((preset) => (
            <button
              key={preset.ticker}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`text-left p-3 rounded-xl border text-xs transition-all ${
                ticker === preset.ticker
                  ? 'border-blue-500 bg-blue-950/40 text-white'
                  : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between font-semibold text-blue-400 mb-1">
                <span>{preset.ticker}</span>
                <span className="text-[10px] text-slate-400">{preset.company}</span>
              </div>
              <p className="line-clamp-2 text-slate-300 leading-relaxed text-[11px]">
                {preset.question}
              </p>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ticker & Audience Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              Ticker / Target Symbol
            </label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="e.g. NVDA, AAPL, MSFT, TSLA"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              Target Deliverable Audience
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="BOARD_OF_DIRECTORS">Board of Directors</option>
              <option value="INVESTMENT_COMMITTEE">Investment Committee</option>
              <option value="CFO_EXECUTIVE">CFO & Executive Suite</option>
              <option value="AUDIT_COMMITTEE">Audit & Compliance Committee</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              Primary Modeling Lens
            </label>
            <select
              value={valuationType}
              onChange={(e) => setValuationType(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="COMPREHENSIVE">Comprehensive (DCF + DuPont + Solvency)</option>
              <option value="DCF_AND_MULTIPLES">5-Year DCF & Multiples Bridge</option>
              <option value="DUPONT_AND_MARGINS">DuPont 5-Stage Profitability</option>
              <option value="SOLVENCY_AND_STRESS">Solvency, Covenants & Stress Test</option>
            </select>
          </div>
        </div>

        {/* Question Textarea */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              Financial Investigation Scope & Specific Inquiries
            </span>
            <span className="text-[11px] text-slate-400">Natural language prompt accepted</span>
          </label>
          <textarea
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Specify financial questions, e.g. 'Assess intrinsic valuation under a conservative 9.5% WACC and 3% terminal growth rate. How do current gross margins impact the valuation bridge?'"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Custom Data Accordion Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowCustomData(!showCustomData)}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            {showCustomData ? 'Hide custom statements & 10-K notes' : '+ Optional: Paste proprietary 10-K notes or custom financial statements'}
          </button>

          {showCustomData && (
            <div className="mt-2.5">
              <textarea
                rows={4}
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
                placeholder="Paste customized balance sheet items, income statement lines, or private company financials here (e.g. Revenue: $450M, EBIT: $95M, Cash: $80M, Total Debt: $40M, Shares: 50M)..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isResearching || !question.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <Search className={`w-4 h-4 ${isResearching ? 'animate-spin' : ''}`} />
            {isResearching ? 'Agent Researching & Auditing...' : 'Launch Autonomous Financial Audit'}
          </button>
        </div>
      </form>
    </div>
  );
};
