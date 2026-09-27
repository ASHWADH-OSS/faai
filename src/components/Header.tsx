import React from 'react';
import { ShieldCheck, Download, RefreshCw, Presentation, FileText, Sliders, Database, MessageSquare } from 'lucide-react';
import { FinancialReport } from '../types/finance';
import { downloadBoardPresentationPptx } from '../services/pptxGenerator';

interface HeaderProps {
  activeTab: 'presentation' | 'report' | 'sandbox' | 'evidence' | 'chat';
  setActiveTab: (tab: 'presentation' | 'report' | 'sandbox' | 'evidence' | 'chat') => void;
  report: FinancialReport | null;
  onNewResearch: () => void;
  isResearching: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  report,
  onNewResearch,
  isResearching,
}) => {
  const [downloadingPptx, setDownloadingPptx] = React.useState(false);

  const handleDownloadPptx = async () => {
    if (!report) return;
    try {
      setDownloadingPptx(true);
      await downloadBoardPresentationPptx(report);
    } catch (err) {
      console.error('Failed to generate PPTX:', err);
    } finally {
      setDownloadingPptx(false);
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            FinAudit AI
          </span>
        </div>

        {/* Zone 2: Clean text navigation links / tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('presentation')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'presentation'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            Board Presentation
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'report'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Audit Report
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Live DCF Sandbox
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'evidence'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Evidence Ledger
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Analyst Q&A
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onNewResearch}
            disabled={isResearching}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResearching ? 'animate-spin' : ''}`} />
            New Research
          </button>

          {report && (
            <button
              onClick={handleDownloadPptx}
              disabled={downloadingPptx}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-sm shadow-blue-600/30 flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
              title="Download editable PowerPoint presentation"
            >
              <Download className="w-3.5 h-3.5" />
              {downloadingPptx ? 'Exporting...' : 'Download Deck (.pptx)'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
