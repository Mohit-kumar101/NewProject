import {
  DOCUMENT_CONVERTER_SLUGS,
  type DocumentConverterSlug,
} from "@/lib/customToolSlugs";

export type { DocumentConverterSlug };
export { DOCUMENT_CONVERTER_SLUGS } from "@/lib/customToolSlugs";

export type DocumentToolMode =
  | "pdf-to-text"
  | "text-to-pdf"
  | "images-to-pdf"
  | "pdf-to-images"
  | "html-to-pdf"
  | "markdown-to-pdf"
  | "merge-pdfs"
  | "split-pdf";

export type DocumentDirection = {
  id: DocumentToolMode;
  label: string;
  accept: string;
  multiple: boolean;
  /** Show paste textarea for text/html/markdown. */
  textInput?: "text" | "html" | "markdown";
  /** Split-specific controls. */
  splitControls?: boolean;
  /** Image extract format controls. */
  imageExtractControls?: boolean;
  hint: string;
};

export type DocumentConverterToolConfig = {
  slug: DocumentConverterSlug;
  formulaType: string;
  title: string;
  directions: DocumentDirection[];
};

export const DOCUMENT_CONVERTER_TOOLS: Record<
  DocumentConverterSlug,
  DocumentConverterToolConfig
> = {
  "pdf-text-converter": {
    slug: "pdf-text-converter",
    formulaType: "pdfTextConverter",
    title: "PDF ↔ Text Converter",
    directions: [
      {
        id: "pdf-to-text",
        label: "PDF → Text",
        accept: ".pdf,application/pdf",
        multiple: false,
        hint: "Extracts selectable text page-by-page with a live progress bar.",
      },
      {
        id: "text-to-pdf",
        label: "Text → PDF",
        accept: ".txt,text/plain",
        multiple: false,
        textInput: "text",
        hint: "Wraps plain text into a multi-page PDF via jsPDF.",
      },
    ],
  },
  "images-pdf-converter": {
    slug: "images-pdf-converter",
    formulaType: "imagesPdfConverter",
    title: "Images ↔ PDF Converter",
    directions: [
      {
        id: "images-to-pdf",
        label: "Images → PDF",
        accept: ".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif",
        multiple: true,
        hint: "Embeds each image as its own PDF page (pdf-lib).",
      },
      {
        id: "pdf-to-images",
        label: "PDF → Images",
        accept: ".pdf,application/pdf",
        multiple: false,
        imageExtractControls: true,
        hint: "Renders every page to PNG/JPG and downloads a ZIP.",
      },
    ],
  },
  "html-markdown-pdf-converter": {
    slug: "html-markdown-pdf-converter",
    formulaType: "htmlMarkdownPdfConverter",
    title: "HTML / Markdown to PDF",
    directions: [
      {
        id: "html-to-pdf",
        label: "HTML → PDF",
        accept: ".html,.htm,text/html",
        multiple: false,
        textInput: "html",
        hint: "Rasters HTML with html2canvas, then paginates with jsPDF.",
      },
      {
        id: "markdown-to-pdf",
        label: "Markdown → PDF",
        accept: ".md,.markdown,text/markdown",
        multiple: false,
        textInput: "markdown",
        hint: "Parses Markdown, then renders to a multi-page PDF.",
      },
    ],
  },
  "pdf-merge-split": {
    slug: "pdf-merge-split",
    formulaType: "pdfMergeSplit",
    title: "PDF Merger & Splitter",
    directions: [
      {
        id: "merge-pdfs",
        label: "Merge PDFs",
        accept: ".pdf,application/pdf",
        multiple: true,
        hint: "Combine multiple PDFs into one document (pdf-lib).",
      },
      {
        id: "split-pdf",
        label: "Split PDF",
        accept: ".pdf,application/pdf",
        multiple: false,
        splitControls: true,
        hint: "Split into every page or custom page ranges — ZIP download.",
      },
    ],
  },
};

export function getDocumentConverterTool(
  slug: string
): DocumentConverterToolConfig | undefined {
  if ((DOCUMENT_CONVERTER_SLUGS as readonly string[]).includes(slug)) {
    return DOCUMENT_CONVERTER_TOOLS[slug as DocumentConverterSlug];
  }
  return undefined;
}
