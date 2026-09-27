import React from 'react';
import { CheckCircle2, Loader2, Search, Calculator, ShieldCheck, FileSpreadsheet } from 'lucide-react';

interface AgentProgressProps {
  currentStage: number; // 1 to 5
  companyName?: string;
  ticker?: string;
}

const STAGES = [
  {
    step: 1,
    title: 'Hypothesis & Question Decomposition',
    desc: 'Breaking inquiry into empirical valuation and operational test vectors',
    icon: Search,
  },
  {
    step: 2,
    title: 'Grounded Evidence Retrieval',
    desc: 'Extracting audited SEC 10-K/10-Q filings, consensus forecasts & Treasury yields',
    icon: FileSpreadsheet,
  },
  {
    step: 3,
    title: 'Deterministic Math & Valuation Engine',
    desc: 'Computing 5-Year UFCF, WACC via CAPM, DuPont 5-stage & solvency ratios',
    icon: Calculator,
  },
  {
    step: 4,
    title: 'Forensic Audit & Checksum Verification',
    desc: 'Verifying mathematical identities, accrual quality & balance sheet tie-outs',
    icon: ShieldCheck,
  },
  {
    step: 5,
    title: 'Board Presentation & Report Synthesis',
    desc: 'Compiling editable 16:9 PowerPoint deck (.pptx) & institutional audit report',
    icon: CheckCircle2,
  },
];

export const AgentProgress: React.FC<AgentProgressProps> = ({ currentStage, companyName, ticker }) => {
  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            Autonomous Agent In Progress: {companyName || ticker || 'Target Company'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Conducting forensic financial research, deterministic math reconciliation, and presentation assembly.
          </p>
        </div>
        <div className="text-xs font-mono text-blue-400 bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-900/60">
          Stage {currentStage} of 5
        </div>
      </div>

      <div className="space-y-4">
        {STAGES.map((s) => {
          const isDone = currentStage > s.step;
          const isCurrent = currentStage === s.step;
          const isPending = currentStage < s.step;
          const Icon = s.icon;

          return (
            <div
              key={s.step}
              className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                isCurrent
                  ? 'border-blue-500/80 bg-blue-950/30'
                  : isDone
                  ? 'border-emerald-900/50 bg-emerald-950/20'
                  : 'border-slate-800/60 bg-slate-950/40 opacity-50'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isDone ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-sm font-semibold ${
                      isCurrent ? 'text-white' : isDone ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </h4>
                  <span
                    className={`text-[11px] font-mono ${
                      isCurrent ? 'text-blue-400' : isDone ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {isCurrent ? 'PROCESSING' : isDone ? 'COMPLETED' : 'QUEUED'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
