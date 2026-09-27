import React, { useState, useMemo } from 'react';
import { Sliders, RotateCcw, TrendingUp, TrendingDown, DollarSign, Calculator } from 'lucide-react';
import { FinancialReport } from '../types/finance';
import { executeVerifiedDCF, DCFInputs } from '../services/financialMath';

interface InteractiveSensitivitySandboxProps {
  report: FinancialReport;
}

export const InteractiveSensitivitySandbox: React.FC<InteractiveSensitivitySandboxProps> = ({ report }) => {
  const baseDcf = report.dcfModel;

  // Base state initializers
  const [wacc, setWacc] = useState(baseDcf.wacc);
  const [terminalGrowth, setTerminalGrowth] = useState(baseDcf.terminalGrowthRate);
  const [ebitMargin, setEbitMargin] = useState(
    baseDcf.projectedRevenue[0] > 0 ? baseDcf.projectedEbit[0] / baseDcf.projectedRevenue[0] : 0.30
  );
  const [growthAdjustment, setGrowthAdjustment] = useState(0); // in percent, e.g. 0%
  const [taxRate, setTaxRate] = useState(baseDcf.taxRate);

  const handleReset = () => {
    setWacc(baseDcf.wacc);
    setTerminalGrowth(baseDcf.terminalGrowthRate);
    setEbitMargin(baseDcf.projectedRevenue[0] > 0 ? baseDcf.projectedEbit[0] / baseDcf.projectedRevenue[0] : 0.30);
    setGrowthAdjustment(0);
    setTaxRate(baseDcf.taxRate);
  };

  // Re-run verified calculation instantly
  const liveResult = useMemo(() => {
    // Base 5-year growth rates modified by growthAdjustment
    const baseGrowth = [0.25, 0.20, 0.16, 0.12, 0.10];
    const modifiedGrowth = baseGrowth.map((g) => Math.max(0.01, g * (1 + growthAdjustment / 100)));

    const inputs: DCFInputs = {
      currentPrice: report.currentPrice,
      sharesOutstanding: baseDcf.sharesOutstanding,
      cashAndEquivalents: baseDcf.enterpriseValue - baseDcf.equityValue > 0 ? 0 : Math.abs(baseDcf.netDebt),
      totalDebt: baseDcf.netDebt > 0 ? baseDcf.netDebt : 0,
      baseRevenue: baseDcf.projectedRevenue[0] / 1.25, // back out approx base
      revenueGrowthRates: modifiedGrowth,
      ebitMargin,
      taxRate,
      dnaPercentOfRevenue: 0.03,
      capexPercentOfRevenue: 0.04,
      nwcPercentOfRevenue: 0.02,
      riskFreeRate: baseDcf.riskFreeRate,
      beta: baseDcf.beta,
      equityRiskPremium: baseDcf.equityRiskPremium,
      costOfDebtPreTax: baseDcf.costOfDebt,
      terminalGrowthRate: terminalGrowth,
    };

    return executeVerifiedDCF(inputs);
  }, [wacc, terminalGrowth, ebitMargin, growthAdjustment, taxRate, report, baseDcf]);

  const upside = liveResult.upsideDownsidePercent;
  const isUndervalued = upside >= 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Interactive Financial Valuation & Sensitivity Sandbox
          </span>
          <span className="text-slate-600 text-xs">·</span>
          <span className="text-xs text-slate-400">
            Live Deterministic Recalculation Engine
          </span>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to Baseline
        </button>
      </div>

      {/* Main KPI Spotlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Live Implied Share Price</div>
          <div className="text-3xl font-extrabold text-white mt-1 tabular-nums">
            ${liveResult.impliedPrice.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Baseline: ${report.targetPrice.toFixed(2)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Margin of Safety vs Market</div>
          <div className={`text-3xl font-extrabold mt-1 tabular-nums flex items-center gap-1 ${isUndervalued ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isUndervalued ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Current Price: ${report.currentPrice.toFixed(2)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Enterprise Value</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-1 tabular-nums">
            ${(liveResult.enterpriseValue / 1000).toFixed(1)}B
          </div>
          <div className="text-xs text-slate-400 mt-1">
            PV Cash Flows + Terminal
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Equity Value (Net Claims Bridge)</div>
          <div className="text-3xl font-extrabold text-slate-200 mt-1 tabular-nums">
            ${(liveResult.equityValue / 1000).toFixed(1)}B
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Net Debt: ${(liveResult.netDebt / 1000).toFixed(1)}B
          </div>
        </div>
      </div>

      {/* Interactive Controls & Sensitivity Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-400" />
            Dynamic Model Input Parameters
          </h3>

          {/* Slider 1: WACC */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-300">WACC Discount Rate (Hurdle)</span>
              <span className="font-mono font-bold text-blue-400">{(wacc * 100).toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="0.06"
              max="0.16"
              step="0.0025"
              value={wacc}
              onChange={(e) => setWacc(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>6.0% (Accommodative)</span>
              <span>Baseline: {(baseDcf.wacc * 100).toFixed(1)}%</span>
              <span>16.0% (Restricted)</span>
            </div>
          </div>

          {/* Slider 2: Terminal Growth Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-300">Terminal Perpetual Growth (g)</span>
              <span className="font-mono font-bold text-blue-400">{(terminalGrowth * 100).toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="0.015"
              max="0.045"
              step="0.0025"
              value={terminalGrowth}
              onChange={(e) => setTerminalGrowth(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1.5% (Low GDP)</span>
              <span>Baseline: {(baseDcf.terminalGrowthRate * 100).toFixed(1)}%</span>
              <span>4.5% (High GDP)</span>
            </div>
          </div>

          {/* Slider 3: Operating (EBIT) Margin */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-300">Target Operating (EBIT) Margin</span>
              <span className="font-mono font-bold text-emerald-400">{(ebitMargin * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.80"
              step="0.01"
              value={ebitMargin}
              onChange={(e) => setEbitMargin(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10% (Margin Compression)</span>
              <span>Current</span>
              <span>80% (Hyper-Scale)</span>
            </div>
          </div>

          {/* Slider 4: Revenue Growth Modifier */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-300">Revenue Growth Pace Modifier</span>
              <span className="font-mono font-bold text-amber-400">
                {growthAdjustment >= 0 ? '+' : ''}{growthAdjustment}%
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="5"
              value={growthAdjustment}
              onChange={(e) => setGrowthAdjustment(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-40% (Recession Shock)</span>
              <span>0% (Consensus)</span>
              <span>+40% (Boom Cycle)</span>
            </div>
          </div>

          {/* Slider 5: Effective Tax Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-300">Effective Corporate Tax Rate</span>
              <span className="font-mono font-bold text-slate-300">{(taxRate * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.30"
              step="0.01"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10% Statutory Min</span>
              <span>21% US Federal</span>
              <span>30% International Drag</span>
            </div>
          </div>
        </div>

        {/* Live Dynamic Sensitivity Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Dynamic 2D Sensitivity Grid
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                WACC vs Terminal Growth
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Every cell reflects a full re-computation of discrete cash flows and terminal value bridge under current margin settings:
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 p-2">
            <table className="w-full text-center text-xs font-mono">
              <thead className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700">
                <tr>
                  <th className="p-2 text-left font-sans">WACC \ g</th>
                  {liveResult.sensitivityMatrix.growthValues.map((g, gi) => (
                    <th key={gi} className="p-2">
                      {(g * 100).toFixed(2)}%
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {liveResult.sensitivityMatrix.waccValues.map((wVal, wi) => (
                  <tr key={wi} className="hover:bg-slate-800/30">
                    <td className="p-2 text-left font-sans font-bold text-slate-300">
                      {(wVal * 100).toFixed(2)}%
                    </td>
                    {liveResult.sensitivityMatrix.prices[wi].map((p, pi) => {
                      const isCenter = wi === 2 && pi === 2;
                      return (
                        <td
                          key={pi}
                          className={`p-2 tabular-nums transition-colors ${
                            isCenter
                              ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400 rounded'
                              : p >= report.currentPrice
                              ? 'text-emerald-400 font-medium'
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

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
            <span className="text-blue-400 font-bold uppercase mr-1">Takeaway:</span>
            At an operating margin of {(ebitMargin * 100).toFixed(1)}%, the model supports an intrinsic value range of
            ${liveResult.sensitivityMatrix.prices[4][0]?.toFixed(2)} to ${liveResult.sensitivityMatrix.prices[0][4]?.toFixed(2)}.
          </div>
        </div>
      </div>
    </div>
  );
};
