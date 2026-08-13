import type { ConvertResult } from "@/lib/dataConverters";
import {
  base64ToText,
  csvToJson,
  csvToTsv,
  htmlToMarkdown,
  jsonToCsv,
  jsonToProperties,
  jsonToXml,
  jsonToYaml,
  markdownToHtml,
  propertiesToJson,
  textToBase64,
  tsvToCsv,
  xmlToJson,
  yamlToJson,
} from "@/lib/dataConverters";
import {
  DATA_CONVERTER_SLUGS,
  type DataConverterSlug,
} from "@/lib/customToolSlugs";

export type { DataConverterSlug };
export { DATA_CONVERTER_SLUGS, CUSTOM_TOOL_SLUGS, isDataConverterSlug } from "@/lib/customToolSlugs";

export type ConverterDirection = {
  id: string;
  label: string;
  fromLabel: string;
  toLabel: string;
  accept: string;
  placeholder: string;
  convert: (input: string) => ConvertResult | Promise<ConvertResult>;
  defaultFilename: string;
};

export type DataConverterToolConfig = {
  slug: string;
  formulaType: string;
  title: string;
  directions: ConverterDirection[];
};

export const DATA_CONVERTER_TOOLS: Record<DataConverterSlug, DataConverterToolConfig> = {
  "json-csv-converter": {
    slug: "json-csv-converter",
    formulaType: "jsonCsvConverter",
    title: "JSON ↔ CSV Converter",
    directions: [
      {
        id: "json-to-csv",
        label: "JSON → CSV",
        fromLabel: "JSON",
        toLabel: "CSV",
        accept: ".json,application/json,text/json",
        placeholder: '[\n  { "name": "Ada", "score": 98 },\n  { "name": "Alan", "score": 91 }\n]',
        convert: jsonToCsv,
        defaultFilename: "converted.csv",
      },
      {
        id: "csv-to-json",
        label: "CSV → JSON",
        fromLabel: "CSV",
        toLabel: "JSON",
        accept: ".csv,text/csv",
        placeholder: "name,score\nAda,98\nAlan,91",
        convert: csvToJson,
        defaultFilename: "converted.json",
      },
    ],
  },
  "xml-json-converter": {
    slug: "xml-json-converter",
    formulaType: "xmlJsonConverter",
    title: "XML ↔ JSON Converter",
    directions: [
      {
        id: "xml-to-json",
        label: "XML → JSON",
        fromLabel: "XML",
        toLabel: "JSON",
        accept: ".xml,application/xml,text/xml",
        placeholder: '<?xml version="1.0"?>\n<root>\n  <item id="1">Hello</item>\n</root>',
        convert: xmlToJson,
        defaultFilename: "converted.json",
      },
      {
        id: "json-to-xml",
        label: "JSON → XML",
        fromLabel: "JSON",
        toLabel: "XML",
        accept: ".json,application/json",
        placeholder: '{\n  "root": {\n    "item": {\n      "@id": "1",\n      "#text": "Hello"\n    }\n  }\n}',
        convert: jsonToXml,
        defaultFilename: "converted.xml",
      },
    ],
  },
  "yaml-json-converter": {
    slug: "yaml-json-converter",
    formulaType: "yamlJsonConverter",
    title: "YAML ↔ JSON Converter",
    directions: [
      {
        id: "yaml-to-json",
        label: "YAML → JSON",
        fromLabel: "YAML",
        toLabel: "JSON",
        accept: ".yaml,.yml,text/yaml,application/x-yaml",
        placeholder: "name: CalculioHub\nfeatures:\n  - converters\n  - calculators",
        convert: yamlToJson,
        defaultFilename: "converted.json",
      },
      {
        id: "json-to-yaml",
        label: "JSON → YAML",
        fromLabel: "JSON",
        toLabel: "YAML",
        accept: ".json,application/json",
        placeholder: '{\n  "name": "CalculioHub",\n  "features": ["converters", "calculators"]\n}',
        convert: jsonToYaml,
        defaultFilename: "converted.yaml",
      },
    ],
  },
  "csv-tsv-converter": {
    slug: "csv-tsv-converter",
    formulaType: "csvTsvConverter",
    title: "CSV ↔ TSV Converter",
    directions: [
      {
        id: "csv-to-tsv",
        label: "CSV → TSV",
        fromLabel: "CSV",
        toLabel: "TSV",
        accept: ".csv,text/csv",
        placeholder: "name,city,score\nAda,London,98\nAlan,Cambridge,91",
        convert: csvToTsv,
        defaultFilename: "converted.tsv",
      },
      {
        id: "tsv-to-csv",
        label: "TSV → CSV",
        fromLabel: "TSV",
        toLabel: "CSV",
        accept: ".tsv,text/tab-separated-values",
        placeholder: "name\tcity\tscore\nAda\tLondon\t98\nAlan\tCambridge\t91",
        convert: tsvToCsv,
        defaultFilename: "converted.csv",
      },
    ],
  },
  "html-markdown-converter": {
    slug: "html-markdown-converter",
    formulaType: "htmlMarkdownConverter",
    title: "HTML ↔ Markdown Converter",
    directions: [
      {
        id: "html-to-md",
        label: "HTML → Markdown",
        fromLabel: "HTML",
        toLabel: "Markdown",
        accept: ".html,.htm,text/html",
        placeholder: "<h1>Hello</h1>\n<p>Convert <strong>HTML</strong> to Markdown.</p>",
        convert: htmlToMarkdown,
        defaultFilename: "converted.md",
      },
      {
        id: "md-to-html",
        label: "Markdown → HTML",
        fromLabel: "Markdown",
        toLabel: "HTML",
        accept: ".md,.markdown,text/markdown",
        placeholder: "# Hello\n\nConvert **Markdown** to HTML.",
        convert: markdownToHtml,
        defaultFilename: "converted.html",
      },
    ],
  },
  "base64-text-converter": {
    slug: "base64-text-converter",
    formulaType: "base64TextConverter",
    title: "Base64 ↔ Text Converter",
    directions: [
      {
        id: "text-to-base64",
        label: "Text → Base64",
        fromLabel: "Text",
        toLabel: "Base64",
        accept: ".txt,text/plain",
        placeholder: "Hello, CalculioHub!",
        convert: textToBase64,
        defaultFilename: "encoded.b64",
      },
      {
        id: "base64-to-text",
        label: "Base64 → Text",
        fromLabel: "Base64",
        toLabel: "Text",
        accept: ".b64,.txt,text/plain",
        placeholder: "SGVsbG8sIENhbGN1bGlvSHViIQ==",
        convert: base64ToText,
        defaultFilename: "decoded.txt",
      },
    ],
  },
  "properties-json-converter": {
    slug: "properties-json-converter",
    formulaType: "propertiesJsonConverter",
    title: "Properties ↔ JSON Converter",
    directions: [
      {
        id: "properties-to-json",
        label: "Properties → JSON",
        fromLabel: "Properties",
        toLabel: "JSON",
        accept: ".properties,text/plain",
        placeholder: "# app config\napp.name=CalculioHub\napp.debug=true",
        convert: propertiesToJson,
        defaultFilename: "converted.json",
      },
      {
        id: "json-to-properties",
        label: "JSON → Properties",
        fromLabel: "JSON",
        toLabel: "Properties",
        accept: ".json,application/json",
        placeholder: '{\n  "app.name": "CalculioHub",\n  "app.debug": "true"\n}',
        convert: jsonToProperties,
        defaultFilename: "converted.properties",
      },
    ],
  },
};

export function getDataConverterTool(
  slug: string
): DataConverterToolConfig | undefined {
  if ((DATA_CONVERTER_SLUGS as readonly string[]).includes(slug)) {
    return DATA_CONVERTER_TOOLS[slug as DataConverterSlug];
  }
  return undefined;
}
