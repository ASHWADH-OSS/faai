/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ResearchInput } from './components/ResearchInput';
import { AgentProgress } from './components/AgentProgress';
import { PresentationViewer } from './components/PresentationViewer';
import { AuditReportViewer } from './components/AuditReportViewer';
import { InteractiveSensitivitySandbox } from './components/InteractiveSensitivitySandbox';
import { EvidenceLedger } from './components/EvidenceLedger';
import { AnalystChat } from './components/AnalystChat';
import { FinancialReport, ResearchRequest } from './types/finance';
import { ShieldCheck, TrendingUp, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'presentation' | 'report' | 'sandbox' | 'evidence' | 'chat'>('presentation');
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [showInputForm, setShowInputForm] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTarget, setCurrentTarget] = useState<{ ticker?: string; companyName?: string }>({
    ticker: 'NVDA',
    companyName: 'NVIDIA Corporation',
  });

  const runResearch = async (request: ResearchRequest) => {
    setIsResearching(true);
    setError(null);
    setCurrentStage(1);
    setCurrentTarget({ ticker: request.ticker, companyName: request.companyName });

    // Stage progression animation
    const stageTimer1 = setTimeout(() => setCurrentStage(2), 1200);
    const stageTimer2 = setTimeout(() => setCurrentStage(3), 2600);
    const stageTimer3 = setTimeout(() => setCurrentStage(4), 4000);
    const stageTimer4 = setTimeout(() => setCurrentStage(5), 5200);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned ${response.status}`);
      }

      const reportData: FinancialReport = await response.json();
      setReport(reportData);
      setShowInputForm(false);
      setActiveTab('presentation');
    } catch (err: any) {
      console.error('Research error:', err);
      setError(err.message || 'An error occurred during financial analysis.');
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      clearTimeout(stageTimer4);
      setIsResearching(false);
    }
  };

  // On mount, auto-run initial seed analysis if no report
  useEffect(() => {
    runResearch({
      question: "Is NVIDIA's current market valuation justified by long-term hyperscaler AI CapEx and GPU gross margin sustainability?",
      ticker: 'NVDA',
      valuationType: 'COMPREHENSIVE',
      targetAudience: 'BOARD_OF_DIRECTORS',
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        report={report}
        onNewResearch={() => setShowInputForm(true)}
        isResearching={isResearching}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-400 hover:text-white underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Progress State */}
        {isResearching ? (
          <AgentProgress
            currentStage={currentStage}
            companyName={currentTarget.companyName}
            ticker={currentTarget.ticker}
          />
        ) : showInputForm ? (
          /* Form View */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowInputForm(false)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Active Audit Deliverables
              </button>
            </div>
            <ResearchInput onSubmit={runResearch} isResearching={isResearching} />
          </div>
        ) : report ? (
          /* Active Report Tabs */
          <div className="space-y-6">
            {/* Quick Context Pill bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-white">{report.companyName}</span>
                <span className="text-slate-500 font-mono">({report.ticker})</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">Target: <strong className="text-white">${report.targetPrice.toFixed(2)}</strong></span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">Market: <strong className="text-slate-300">${report.currentPrice.toFixed(2)}</strong></span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400 font-mono">
                  {report.impliedReturnPercent >= 0 ? '+' : ''}{report.impliedReturnPercent.toFixed(1)}% Implied
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Audit Opinion:</span>
                <span className="font-bold text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {report.auditValidation.auditOpinion}
                </span>
              </div>
            </div>

            {/* Tab Body */}
            {activeTab === 'presentation' && <PresentationViewer report={report} />}
            {activeTab === 'report' && <AuditReportViewer report={report} />}
            {activeTab === 'sandbox' && <InteractiveSensitivitySandbox report={report} />}
            {activeTab === 'evidence' && <EvidenceLedger report={report} />}
            {activeTab === 'chat' && <AnalystChat report={report} />}
          </div>
        ) : (
          /* Empty Initial State */
          <ResearchInput onSubmit={runResearch} isResearching={isResearching} />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="no-print border-t border-slate-800/80 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">FinAudit AI</span>
            <span>·</span>
            <span>Autonomous Financial Research & Forensic Valuation Deck Engine</span>
          </div>
          <div className="text-[11px] text-slate-600 font-mono">
            ASC 606 / US GAAP Checksum Reconciled · Board & Investment Committee Standard
          </div>
        </div>
      </footer>
    </div>
  );
}
