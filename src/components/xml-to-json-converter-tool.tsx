"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, Copy, Trash2, CheckCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolEvents } from "@/lib/analytics";

type Direction = "xml-to-json" | "json-to-xml";

// ── XML → JSON ────────────────────────────────────────────────────────────────

function domNodeToObject(node: Element): unknown {
  const result: Record<string, unknown> = {};

  if (node.attributes.length > 0) {
    const attrs: Record<string, string> = {};
    for (const attr of Array.from(node.attributes)) {
      attrs[attr.name] = attr.value;
    }
    result["@attributes"] = attrs;
  }

  const children = Array.from(node.childNodes);
  const elementChildren = children.filter((n) => n.nodeType === Node.ELEMENT_NODE) as Element[];
  const textChildren = children.filter((n) => n.nodeType === Node.TEXT_NODE);
  const textContent = textChildren.map((n) => n.textContent ?? "").join("").trim();

  if (elementChildren.length === 0) {
    if (Object.keys(result).length === 0) return textContent;
    if (textContent) result["#text"] = textContent;
    return result;
  }

  const grouped: Record<string, unknown[]> = {};
  for (const child of elementChildren) {
    const tag = child.tagName;
    if (!grouped[tag]) grouped[tag] = [];
    grouped[tag].push(domNodeToObject(child));
  }

  for (const [tag, values] of Object.entries(grouped)) {
    result[tag] = values.length === 1 ? values[0] : values;
  }

  if (textContent && elementChildren.length > 0) {
    result["#text"] = textContent;
  }

  return result;
}

function xmlToJson(xml: string, pretty: boolean): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) throw new Error(parseError.textContent ?? "Invalid XML");
  const root = doc.documentElement;
  const obj: Record<string, unknown> = {};
  obj[root.tagName] = domNodeToObject(root);
  return JSON.stringify(obj, null, pretty ? 2 : 0);
}

// ── JSON → XML ────────────────────────────────────────────────────────────────

function objectToXml(tag: string, value: unknown, indent: string, pretty: boolean): string {
  const nl = pretty ? "\n" : "";
  const nextIndent = pretty ? indent + "  " : "";

  if (value === null || value === undefined) {
    return `${indent}<${tag}/>${nl}`;
  }

  if (Array.isArray(value)) {
    return value.map((item) => objectToXml(tag, item, indent, pretty)).join("");
  }

  if (typeof value !== "object") {
    const escaped = String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `${indent}<${tag}>${escaped}</${tag}>${nl}`;
  }

  const obj = value as Record<string, unknown>;
  const attrs = obj["@attributes"] as Record<string, string> | undefined;
  const attrStr = attrs
    ? " " + Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(" ")
    : "";

  const innerEntries = Object.entries(obj).filter(([k]) => k !== "@attributes");
  if (innerEntries.length === 0) return `${indent}<${tag}${attrStr}/>${nl}`;

  const textEntry = innerEntries.find(([k]) => k === "#text");
  const childEntries = innerEntries.filter(([k]) => k !== "#text");

  if (childEntries.length === 0 && textEntry) {
    const escaped = String(textEntry[1])
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `${indent}<${tag}${attrStr}>${escaped}</${tag}>${nl}`;
  }

  const children = childEntries
    .map(([k, v]) => objectToXml(k, v, nextIndent, pretty))
    .join("");

  return `${indent}<${tag}${attrStr}>${nl}${children}${indent}</${tag}>${nl}`;
}

function jsonToXml(json: string, pretty: boolean): string {
  const obj = JSON.parse(json) as Record<string, unknown>;
  const entries = Object.entries(obj);
  if (entries.length === 0) throw new Error("JSON object is empty");
  const [rootTag, rootValue] = entries[0];
  const declaration = pretty ? '<?xml version="1.0" encoding="UTF-8"?>\n' : '<?xml version="1.0" encoding="UTF-8"?>';
  return declaration + objectToXml(rootTag, rootValue, "", pretty);
}

// ── Component ─────────────────────────────────────────────────────────────────

export function XmlToJsonConverterTool() {
  const [direction, setDirection] = useState<Direction>("xml-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [pretty, setPretty] = useState(true);
  const [copied, setCopied] = useState(false);

  const convert = useCallback(
    (value: string, dir: Direction, prettyMode: boolean) => {
      if (!value.trim()) {
        setOutput("");
        setError("");
        return;
      }
      try {
        const result =
          dir === "xml-to-json"
            ? xmlToJson(value, prettyMode)
            : jsonToXml(value, prettyMode);
        setOutput(result);
        setError("");
        ToolEvents.toolUsed("convert");
      } catch (e) {
        setOutput("");
        setError((e as Error).message);
      }
    },
    []
  );

  const handleInputChange = (value: string) => {
    setInput(value);
    convert(value, direction, pretty);
  };

  const handleDirectionToggle = () => {
    const next: Direction = direction === "xml-to-json" ? "json-to-xml" : "xml-to-json";
    setDirection(next);
    setInput(output);
    setOutput("");
    setError("");
    convert(output, next, pretty);
  };

  const handlePrettyToggle = () => {
    const next = !pretty;
    setPretty(next);
    convert(input, direction, next);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard!");
    ToolEvents.resultCopied();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const inputLabel = direction === "xml-to-json" ? "XML Input" : "JSON Input";
  const outputLabel = direction === "xml-to-json" ? "JSON Output" : "XML Output";
  const inputPlaceholder =
    direction === "xml-to-json"
      ? `<person>\n  <name>Alice</name>\n  <age>30</age>\n</person>`
      : `{\n  "person": {\n    "name": "Alice",\n    "age": "30"\n  }\n}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDirectionToggle}
          className="gap-2 border-brand/30 hover:border-brand"
        >
          <ArrowLeftRight className="h-4 w-4 text-brand" />
          {direction === "xml-to-json" ? "XML → JSON" : "JSON → XML"}
        </Button>

        <button
          onClick={handlePrettyToggle}
          className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
            pretty
              ? "bg-brand/10 border-brand/30 text-brand"
              : "bg-muted border-border text-muted-foreground hover:border-brand/30"
          }`}
        >
          {pretty ? "Pretty" : "Compact"}
        </button>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </Button>
      </div>

      {/* Editor Panels */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">{inputLabel}</span>
            <Badge variant="secondary" className="text-xs">
              {direction === "xml-to-json" ? "XML" : "JSON"}
            </Badge>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            spellCheck={false}
            className="w-full h-80 rounded-xl border border-border/50 bg-muted/30 p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition-colors placeholder:text-muted-foreground/40"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">{outputLabel}</span>
            <Badge variant="secondary" className="text-xs">
              {direction === "xml-to-json" ? "JSON" : "XML"}
            </Badge>
            {output && (
              <button
                onClick={handleCopy}
                className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-brand/10 hover:bg-brand/20 text-brand border border-brand/20 transition-colors"
              >
                {copied ? (
                  <CheckCheck className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>

          {error ? (
            <div className="h-80 rounded-xl border border-destructive/40 bg-destructive/5 p-4 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive mb-1">Parse error</p>
                <p className="text-xs text-destructive/80 font-mono break-all">{error}</p>
              </div>
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="Output will appear here…"
              spellCheck={false}
              className="w-full h-80 rounded-xl border border-border/50 bg-muted/30 p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition-colors placeholder:text-muted-foreground/40"
            />
          )}
        </div>
      </div>

      {/* Stats bar */}
      {(input || output) && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground"
        >
          <span>Input: {input.length.toLocaleString()} chars</span>
          {output && <span>Output: {output.length.toLocaleString()} chars</span>}
          {output && (
            <span>
              Ratio:{" "}
              {input.length > 0
                ? ((output.length / input.length) * 100).toFixed(0)
                : 0}
              %
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
