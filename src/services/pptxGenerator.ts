import pptxgen from 'pptxgenjs';
import { FinancialReport } from '../types/finance';

/**
 * Generates an institutional, editable, board-ready PowerPoint (.pptx) presentation.
 * Uses native Microsoft PowerPoint shapes, tables, typography, and speaker notes.
 */
export async function downloadBoardPresentationPptx(report: FinancialReport): Promise<void> {
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'FinAudit AI Autonomous Agent';
  pptx.company = 'Institutional Equity Research & Strategic Advisory';
  pptx.title = `${report.companyName} (${report.ticker}) - Board of Directors Presentation`;
  pptx.subject = report.question;

  const NAVY_HEADER = '0F172A';
  const ACCENT_BLUE = '1D4ED8';
  const ACCENT_EMERALD = '047857';
  const LIGHT_GRAY = 'F8FAFC';
  const CARD_BG = 'FFFFFF';
  const BORDER_GRAY = 'CBD5E1';
  const TEXT_DARK = '0F172A';
  const TEXT_MUTED = '64748B';

  const deck = report.presentationDeck;

  // Master Slide Template helper
  const addHeaderAndFooter = (slide: pptxgen.Slide, category: string, slideNumber: number, totalSlides: number) => {
    // Header Bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 0.35,
      w: 12.33,
      h: 0.04,
      fill: { color: ACCENT_BLUE },
    });

    slide.addText(`${report.companyName} (${report.ticker}) · ${category}`, {
      x: 0.5,
      y: 0.15,
      w: 8.0,
      h: 0.25,
      fontSize: 10,
      fontFace: 'Arial',
      bold: true,
      color: ACCENT_BLUE,
    });

    // Date
    slide.addText(`Audit Timestamp: ${new Date(report.generatedAt).toLocaleDateString()}`, {
      x: 8.5,
      y: 0.15,
      w: 4.33,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      align: 'right',
      color: TEXT_MUTED,
    });

    // Footer
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 7.0,
      w: 12.33,
      h: 0.02,
      fill: { color: BORDER_GRAY },
    });

    slide.addText('CONFIDENTIAL · PREPARED FOR THE BOARD OF DIRECTORS · FIN-AUDIT AI VERIFIED', {
      x: 0.5,
      y: 7.05,
      w: 9.0,
      h: 0.3,
      fontSize: 8,
      fontFace: 'Arial',
      color: TEXT_MUTED,
    });

    slide.addText(`Slide ${slideNumber} of ${totalSlides}`, {
      x: 10.0,
      y: 7.05,
      w: 2.83,
      h: 0.3,
      fontSize: 8,
      fontFace: 'Arial',
      align: 'right',
      color: TEXT_MUTED,
    });
  };

  const totalSlides = deck.slides.length || 7;

  deck.slides.forEach((s, idx) => {
    const slide = pptx.addSlide();
    const slideNum = idx + 1;

    // Check if Title Slide
    if (s.layout === 'title' || idx === 0) {
      // Dark Navy Corporate Title Background
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 13.33,
        h: 7.5,
        fill: { color: NAVY_HEADER },
      });

      // Decorative Accent Line
      slide.addShape(pptx.ShapeType.rect, {
        x: 1.0,
        y: 1.5,
        w: 1.2,
        h: 0.08,
        fill: { color: '38BDF8' },
      });

      slide.addText(s.title || `${report.companyName} (${report.ticker})`, {
        x: 1.0,
        y: 1.8,
        w: 11.33,
        h: 1.2,
        fontSize: 32,
        fontFace: 'Arial',
        bold: true,
        color: 'FFFFFF',
        breakLine: true,
      });

      slide.addText(s.subtitle || report.question, {
        x: 1.0,
        y: 3.1,
        w: 11.0,
        h: 0.9,
        fontSize: 18,
        fontFace: 'Arial',
        color: '94A3B8',
        breakLine: true,
      });

      // Key Metrics summary pills on title slide
      const summaryCards = [
        { label: 'Rating & Target', val: `${report.rating} ($${report.targetPrice.toFixed(2)})` },
        { label: 'Current Price', val: `$${report.currentPrice.toFixed(2)} (${report.impliedReturnPercent >= 0 ? '+' : ''}${report.impliedReturnPercent.toFixed(1)}%)` },
        { label: 'Audit Opinion', val: report.auditValidation.auditOpinion },
        { label: 'WACC / Growth', val: `${(report.dcfModel.wacc * 100).toFixed(1)}% / ${(report.dcfModel.terminalGrowthRate * 100).toFixed(1)}%` },
      ];

      summaryCards.forEach((c, cIdx) => {
        const xPos = 1.0 + cIdx * 2.85;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: xPos,
          y: 4.4,
          w: 2.7,
          h: 1.1,
          rectRadius: 0.08,
          fill: { color: '1E293B' },
          line: { color: '334155', width: 1 },
        });

        slide.addText(c.label.toUpperCase(), {
          x: xPos + 0.15,
          y: 4.5,
          w: 2.4,
          h: 0.25,
          fontSize: 9,
          fontFace: 'Arial',
          bold: true,
          color: '94A3B8',
        });

        slide.addText(c.val, {
          x: xPos + 0.15,
          y: 4.8,
          w: 2.4,
          h: 0.55,
          fontSize: 14,
          fontFace: 'Arial',
          bold: true,
          color: '38BDF8',
        });
      });

      // Prepared for footer
      slide.addText(`Prepared for: ${deck.preparedFor || 'The Board of Directors'} · Autonomous Financial Analysis Engine · ${deck.date || new Date().toLocaleDateString()}`, {
        x: 1.0,
        y: 6.4,
        w: 11.33,
        h: 0.4,
        fontSize: 10,
        fontFace: 'Arial',
        color: '64748B',
      });

      if (s.speakerNotes) {
        slide.addNotes(s.speakerNotes);
      }
      return;
    }

    // Standard Slide Frame
    addHeaderAndFooter(slide, s.subtitle || 'Board Briefing', slideNum, totalSlides);

    // Slide Title
    slide.addText(s.title, {
      x: 0.5,
      y: 0.5,
      w: 12.33,
      h: 0.6,
      fontSize: 22,
      fontFace: 'Arial',
      bold: true,
      color: TEXT_DARK,
    });

    // Key Takeaway Top Callout Box
    if (s.keyTakeaway) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.5,
        y: 1.15,
        w: 12.33,
        h: 0.65,
        rectRadius: 0.05,
        fill: { color: LIGHT_GRAY },
        line: { color: 'E2E8F0', width: 1 },
      });

      slide.addText(`EXECUTIVE TAKEAWAY: ${s.keyTakeaway}`, {
        x: 0.65,
        y: 1.25,
        w: 12.0,
        h: 0.45,
        fontSize: 11,
        fontFace: 'Arial',
        bold: true,
        color: ACCENT_BLUE,
      });
    }

    const contentStartY = s.keyTakeaway ? 1.95 : 1.35;

    // KPI Cards row if present
    if (s.kpiCards && s.kpiCards.length > 0) {
      const cardWidth = (12.33 - (s.kpiCards.length - 1) * 0.25) / s.kpiCards.length;
      s.kpiCards.forEach((kpi, kIdx) => {
        const xPos = 0.5 + kIdx * (cardWidth + 0.25);
        slide.addShape(pptx.ShapeType.roundRect, {
          x: xPos,
          y: contentStartY,
          w: cardWidth,
          h: 1.1,
          rectRadius: 0.06,
          fill: { color: CARD_BG },
          line: { color: BORDER_GRAY, width: 1 },
        });

        slide.addText(kpi.label.toUpperCase(), {
          x: xPos + 0.15,
          y: contentStartY + 0.1,
          w: cardWidth - 0.3,
          h: 0.25,
          fontSize: 9,
          fontFace: 'Arial',
          bold: true,
          color: TEXT_MUTED,
        });

        slide.addText(kpi.value, {
          x: xPos + 0.15,
          y: contentStartY + 0.35,
          w: cardWidth - 0.3,
          h: 0.4,
          fontSize: 18,
          fontFace: 'Arial',
          bold: true,
          color: ACCENT_BLUE,
        });

        if (kpi.context || kpi.change) {
          slide.addText(kpi.change || kpi.context || '', {
            x: xPos + 0.15,
            y: contentStartY + 0.75,
            w: cardWidth - 0.3,
            h: 0.25,
            fontSize: 9,
            fontFace: 'Arial',
            color: ACCENT_EMERALD,
          });
        }
      });
    }

    const tableStartY = s.kpiCards && s.kpiCards.length > 0 ? contentStartY + 1.25 : contentStartY;

    // Table Data if present
    if (s.tableData && s.tableData.headers && s.tableData.rows.length > 0) {
      const formattedHeaders = s.tableData.headers.map(h => ({
        text: String(h),
        options: {
          bold: true,
          color: 'FFFFFF',
          fill: { color: NAVY_HEADER },
          fontSize: 10,
          align: 'left' as const,
        },
      }));

      const formattedRows = s.tableData.rows.map((row, rIdx) =>
        row.map((cell, cIdx) => ({
          text: String(cell),
          options: {
            fontSize: 9,
            color: TEXT_DARK,
            fill: { color: rIdx % 2 === 0 ? 'FFFFFF' : 'F8FAFC' },
            bold: cIdx === 0,
            align: cIdx === 0 ? ('left' as const) : ('right' as const),
          },
        }))
      );

      const tableWidth = s.bulletPoints.length > 0 ? 6.5 : 12.33;

      slide.addTable([formattedHeaders, ...formattedRows], {
        x: 0.5,
        y: tableStartY,
        w: tableWidth,
        h: Math.min(3.5, 0.4 * (formattedRows.length + 1)),
        border: { pt: 0.5, color: BORDER_GRAY },
        margin: [4, 6, 4, 6],
      });

      // Bullets alongside table
      if (s.bulletPoints.length > 0) {
        const bulletX = 7.3;
        const bulletItems = s.bulletPoints.map(bp => ({
          text: bp,
          options: {
            fontSize: 11,
            color: TEXT_DARK,
            breakLine: true,
            bullet: { type: 'bullet' as const, color: ACCENT_BLUE },
            spaceAfter: 10,
          },
        }));

        slide.addText(bulletItems, {
          x: bulletX,
          y: tableStartY,
          w: 5.5,
          h: 3.5,
          fontFace: 'Arial',
          lineSpacing: 18,
        });
      }
    } else if (s.bulletPoints && s.bulletPoints.length > 0) {
      // Full-width Bullets with structured cards
      const bulletItems = s.bulletPoints.map(bp => ({
        text: bp,
        options: {
          fontSize: 13,
          color: TEXT_DARK,
          breakLine: true,
          bullet: { type: 'bullet' as const, color: ACCENT_BLUE },
          spaceAfter: 14,
        },
      }));

      slide.addText(bulletItems, {
        x: 0.8,
        y: contentStartY,
        w: 11.7,
        h: 4.8,
        fontFace: 'Arial',
        lineSpacing: 22,
      });
    }

    if (s.speakerNotes) {
      slide.addNotes(s.speakerNotes);
    }
  });

  const fileName = `${report.ticker}_Board_Ready_Presentation_${new Date().toISOString().slice(0, 10)}.pptx`;
  await pptx.writeFile({ fileName });
}
