export const siteConfig = {
  name: "XML to JSON Converter",
  title: "XML to JSON Converter — Free Online XML ↔ JSON Tool",
  description:
    "Instantly convert XML to JSON or JSON to XML in your browser. 100% free, no uploads, fully private. Paste your XML or JSON and get clean, formatted output in seconds.",
  url: "https://xml-to-json-converter.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "FileCode",
  brandAccentColor: "#f59e0b",

  keywords: [
    "xml to json converter",
    "json to xml converter",
    "xml json online",
    "convert xml to json free",
    "xml parser online",
    "json formatter",
    "xml formatter",
    "developer tools",
    "data conversion",
    "free xml tool",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#f97316",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/xml-to-json-converter",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "A free, private XML ↔ JSON converter that runs entirely in your browser. No uploads, no accounts, no data stored.",
    featuresTitle: "Features",
    features: [
      "XML → JSON conversion",
      "JSON → XML conversion",
      "Pretty-print & compact output",
      "One-click copy to clipboard",
    ],
  },

  hero: {
    badge: "100% Free & Private",
    titleLine1: "Convert XML to JSON",
    titleGradient: "Instantly in Your Browser",
    subtitle:
      "Paste XML or JSON and get clean, formatted output in milliseconds. No uploads, no accounts — everything stays on your device.",
  },

  featureCards: [
    {
      icon: "🔄",
      title: "Bidirectional",
      description:
        "Switch between XML→JSON and JSON→XML with a single click. Both directions are equally fast.",
    },
    {
      icon: "🔒",
      title: "100% Private",
      description:
        "All conversion happens in your browser. Nothing is ever sent to a server.",
    },
    {
      icon: "✨",
      title: "Pretty or Compact",
      description:
        "Toggle between nicely indented output and minified single-line output to suit your workflow.",
    },
  ],

  relatedTools: [
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "📋",
      description: "Validate, format and minify JSON instantly.",
    },
    {
      name: "YAML to JSON Converter",
      url: "https://yaml-json-converter.tools.jagodana.com",
      icon: "📄",
      description: "Convert between YAML and JSON with a single click.",
    },
    {
      name: "JSON to CSV Converter",
      url: "https://json-to-csv-converter.tools.jagodana.com",
      icon: "📊",
      description: "Export JSON arrays to CSV for spreadsheets.",
    },
    {
      name: "CSV to JSON Converter",
      url: "https://csv-to-json-converter.tools.jagodana.com",
      icon: "📑",
      description: "Import CSV data and convert to a JSON array.",
    },
    {
      name: "XML Formatter",
      url: "https://xml-formatter.tools.jagodana.com",
      icon: "🗂️",
      description: "Beautify and validate raw XML markup.",
    },
    {
      name: "JSON Diff Viewer",
      url: "https://json-diff-viewer.tools.jagodana.com",
      icon: "🔍",
      description: "Compare two JSON objects and highlight differences.",
    },
  ],

  howToSteps: [
    {
      name: "Paste your XML or JSON",
      text: "Copy your XML or JSON text and paste it into the input panel on the left.",
      url: "",
    },
    {
      name: "Choose conversion direction",
      text: "Select XML → JSON or JSON → XML using the direction toggle above the editor.",
      url: "",
    },
    {
      name: "Copy the output",
      text: "The converted result appears instantly in the right panel. Click Copy to copy it to your clipboard.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "Is the XML to JSON conversion done on the server?",
      answer:
        "No. All conversion happens entirely in your browser using JavaScript. Your data is never sent to any server, making it completely private and secure.",
    },
    {
      question: "Does this tool support XML attributes?",
      answer:
        "Yes. XML attributes are preserved in the JSON output as a special `@attributes` key on the corresponding object, so no information is lost during conversion.",
    },
    {
      question: "Can I convert JSON back to XML?",
      answer:
        "Absolutely. Use the direction toggle to switch to JSON → XML mode and paste your JSON object. The tool produces valid, indented XML markup.",
    },
    {
      question: "What happens with XML namespaces?",
      answer:
        "Namespace prefixes (e.g. `soap:Body`) are kept as-is in the JSON key names, preserving the full qualified name so the structure remains unambiguous.",
    },
    {
      question: "Is there a file size limit?",
      answer:
        "There is no hard limit enforced by the tool — it depends only on your browser's memory. In practice it handles megabyte-scale documents without issue.",
    },
  ],

  pages: {
    "/": {
      title: "XML to JSON Converter — Free Online XML ↔ JSON Tool",
      description:
        "Instantly convert XML to JSON or JSON to XML in your browser. 100% free, no uploads, fully private.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
