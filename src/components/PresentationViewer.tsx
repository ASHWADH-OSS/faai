import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  FileText,
  Sliders,
  Check,
  Edit3
} from 'lucide-react';
import { FinancialReport, SlideContent } from '../types/finance';
import { downloadBoardPresentationPptx } from '../services/pptxGenerator';

interface PresentationViewerProps {
  report: FinancialReport;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({ report }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable slides state
  const [slides, setSlides] = useState<SlideContent[]>(report.presentationDeck.slides);

  useEffect(() => {
    setSlides(report.presentationDeck.slides);
    setCurrentSlideIndex(0);
  }, [report]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, isFullscreen]);

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      // update report copy with edited slides
      const updatedReport: FinancialReport = {
        ...report,
        presentationDeck: {
          ...report.presentationDeck,
          slides,
        },
      };
      await downloadBoardPresentationPptx(updatedReport);
    } catch (err) {
      console.error('Failed to export PPTX:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const updateSlideTakeaway = (newTakeaway: string) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === currentSlideIndex ? { ...s, keyTakeaway: newTakeaway } : s))
    );
  };

  const updateSlideBullet = (bulletIdx: number, newText: string) => {
    setSlides((prev) =>
      prev.map((s, idx) => {
        if (idx === currentSlideIndex) {
          const newBullets = [...s.bulletPoints];
          newBullets[bulletIdx] = newText;
          return { ...s, bulletPoints: newBullets };
        }
        return s;
      })
    );
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 flex flex-col justify-between overflow-auto' : ''}`}>
      {/* Top Presentation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Board-Ready Presentation Deck (16:9)
          </span>
          <span className="text-slate-600 text-xs">·</span>
          <span className="text-xs text-slate-300 font-medium">
            {report.companyName} ({report.ticker})
          </span>
          <span className="text-slate-600 text-xs">·</span>
          <span className="text-xs text-slate-400">
            Slide {currentSlideIndex + 1} of {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              isEditing
                ? 'bg-amber-950/40 border-amber-600/80 text-amber-300'
                : 'bg-slate-950 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Edit slide contents before downloading"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Editing Mode Active' : 'Edit Slide'}
          </button>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              showNotes
                ? 'bg-blue-950/40 border-blue-600/80 text-blue-300'
                : 'bg-slate-950 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Speaker Notes
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Presentation Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-blue-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Generating PPTX...' : 'Download .pptx'}
          </button>
        </div>
      </div>

      {/* Main Slide Stage (16:9 Aspect Ratio Frame) */}
      <div className="relative w-full aspect-[16/9] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 sm:p-10 select-text">
        {/* If Title Slide */}
        {currentSlide.layout === 'title' || currentSlideIndex === 0 ? (
          <div className="h-full flex flex-col justify-between">
            <div className="pt-4">
              <div className="w-12 h-1 bg-blue-500 rounded mb-4" />
              <div className="text-xs uppercase tracking-widest font-bold text-blue-400 mb-1">
                Institutional Financial Valuation & Audit Review
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {currentSlide.title}
              </h1>
              <p className="text-sm sm:text-lg text-slate-300 mt-3 max-w-3xl leading-relaxed">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Title Slide Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Recommendation</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">{report.rating}</div>
                <div className="text-[11px] text-slate-400">Target: ${report.targetPrice.toFixed(2)}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Current Market Price</div>
                <div className="text-lg font-bold text-white mt-1 tabular-nums">${report.currentPrice.toFixed(2)}</div>
                <div className="text-[11px] text-emerald-400 tabular-nums">
                  {report.impliedReturnPercent >= 0 ? '+' : ''}{report.impliedReturnPercent.toFixed(1)}% Implied Return
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Audit Opinion</div>
                <div className="text-lg font-bold text-blue-400 mt-1">{report.auditValidation.auditOpinion}</div>
                <div className="text-[11px] text-slate-400">100% Math Verification</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">WACC / Perpetual Growth</div>
                <div className="text-lg font-bold text-amber-400 mt-1 tabular-nums">
                  {(report.dcfModel.wacc * 100).toFixed(1)}% / {(report.dcfModel.terminalGrowthRate * 100).toFixed(1)}%
                </div>
                <div className="text-[11px] text-slate-400">CAPM Discount Hurdle</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-4">
              <span>Prepared for: The Board of Directors</span>
              <span>Autonomous FinAudit AI Agent · Verified by Mathematical Checksums</span>
            </div>
          </div>
        ) : (
          /* Standard Slide Frame */
          <div className="h-full flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">
                <span>{report.companyName} ({report.ticker}) · {currentSlide.subtitle}</span>
                <span className="text-slate-400">Slide {currentSlideIndex + 1} of {slides.length}</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                {currentSlide.title}
              </h2>

              {/* Key Takeaway Callout */}
              {currentSlide.keyTakeaway && (
                <div className="mt-2.5 p-3 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs text-blue-200">
                  <span className="font-bold text-blue-400 uppercase tracking-wide mr-2">Executive Takeaway:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentSlide.keyTakeaway}
                      onChange={(e) => updateSlideTakeaway(e.target.value)}
                      className="w-full bg-slate-950 border border-blue-600 rounded px-2 py-1 mt-1 text-white text-xs"
                    />
                  ) : (
                    <span>{currentSlide.keyTakeaway}</span>
                  )}
                </div>
              )}
            </div>

            {/* Slide Body */}
            <div className="my-auto space-y-4">
              {/* KPI Cards Row if any */}
              {currentSlide.kpiCards && currentSlide.kpiCards.length > 0 && (
                <div className={`grid grid-cols-2 sm:grid-cols-${Math.min(4, currentSlide.kpiCards.length)} gap-3`}>
                  {currentSlide.kpiCards.map((kpi, kIdx) => (
                    <div key={kIdx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">{kpi.label}</div>
                      <div className="text-base sm:text-xl font-bold text-white mt-0.5 tabular-nums">
                        {kpi.value}
                      </div>
                      {(kpi.change || kpi.context) && (
                        <div className="text-[10px] text-emerald-400 font-medium mt-0.5 tabular-nums">
                          {kpi.change || kpi.context}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Data Table if present */}
              {currentSlide.tableData && (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700">
                      <tr>
                        {currentSlide.tableData.headers.map((h, i) => (
                          <th key={i} className={`p-2.5 ${i === 0 ? 'text-left' : 'text-right'}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {currentSlide.tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-800/40">
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`p-2.5 text-slate-300 ${
                                cIdx === 0 ? 'font-sans font-medium text-white text-left' : 'text-right tabular-nums'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Bullet Points */}
              {currentSlide.bulletPoints && currentSlide.bulletPoints.length > 0 && (
                <div className="space-y-2">
                  {currentSlide.bulletPoints.map((bp, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={bp}
                          onChange={(e) => updateSlideBullet(bIdx, e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                        />
                      ) : (
                        <span className="leading-relaxed">{bp}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
              <span>CONFIDENTIAL · PREPARED FOR THE BOARD OF DIRECTORS · FIN-AUDIT AI VERIFIED</span>
              <span>16:9 Widescreen Master Deck</span>
            </div>
          </div>
        )}
      </div>

      {/* Speaker Notes Drawer */}
      {showNotes && currentSlide.speakerNotes && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <div className="font-bold text-amber-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Speaker / Presenter Notes (CFO / Analyst Briefing Script):
          </div>
          <p className="leading-relaxed text-slate-300 font-mono text-[11px]">
            {currentSlide.speakerNotes}
          </p>
        </div>
      )}

      {/* Slide Navigation Strip & Controls */}
      <div className="flex items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
        <button
          onClick={handlePrev}
          className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-white transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Slide
        </button>

        {/* Thumbnail Dots */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-mono transition-all flex items-center justify-center ${
                currentSlideIndex === idx
                  ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={s.title}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-white transition-colors flex items-center gap-1"
        >
          Next Slide
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
