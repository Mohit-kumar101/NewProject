import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import JSZip from "jszip";

async function captureSlides(root: HTMLElement): Promise<HTMLCanvasElement[]> {
  const slides = Array.from(
    root.querySelectorAll<HTMLElement>("[data-presentation-slide]")
  );
  if (slides.length === 0) {
    throw new Error("No presentation slides found to export.");
  }

  // Let charts finish painting.
  await new Promise((r) => setTimeout(r, 500));

  const canvases: HTMLCanvasElement[] = [];
  for (const slide of slides) {
    const canvas = await html2canvas(slide, {
      scale: 2.5,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      foreignObjectRendering: false,
      onclone: (doc) => {
        doc.querySelectorAll<HTMLElement>("[data-presentation-slide]").forEach((el) => {
          el.style.boxShadow = "none";
        });
      },
    });
    canvases.push(canvas);
  }
  return canvases;
}

function safeName(filenameBase: string): string {
  return (
    filenameBase
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "calculiohub"
  );
}

/**
 * Capture each `[data-presentation-slide]` node as a landscape PDF page.
 */
export async function exportPresentationPdf(
  root: HTMLElement,
  filenameBase: string
): Promise<void> {
  const canvases = await captureSlides(root);
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 16;

  for (let i = 0; i < canvases.length; i += 1) {
    const canvas = canvases[i];
    const img = canvas.toDataURL("image/png");
    const usableW = pageWidth - margin * 2;
    const usableH = pageHeight - margin * 2;
    const ratio = Math.min(usableW / canvas.width, usableH / canvas.height);
    const w = canvas.width * ratio;
    const h = canvas.height * ratio;
    if (i > 0) pdf.addPage();
    pdf.addImage(img, "PNG", (pageWidth - w) / 2, (pageHeight - h) / 2, w, h);
  }

  pdf.save(`${safeName(filenameBase)}-presentation.pdf`);
}

/** One PNG per slide — handy for Google Slides / PowerPoint paste. */
export async function exportPresentationImagesZip(
  root: HTMLElement,
  filenameBase: string
): Promise<void> {
  const canvases = await captureSlides(root);
  const zip = new JSZip();
  const folder = zip.folder("slides");
  if (!folder) throw new Error("Could not create ZIP folder.");

  for (let i = 0; i < canvases.length; i += 1) {
    const dataUrl = canvases[i].toDataURL("image/png");
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
    folder.file(`slide-${String(i + 1).padStart(2, "0")}.png`, base64, {
      base64: true,
    });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName(filenameBase)}-slides.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
