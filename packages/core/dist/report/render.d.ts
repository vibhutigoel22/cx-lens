import type { Report } from './builder.js';
export declare function renderMarkdown(r: Report): string;
/** HTML in the approved report design (see html.ts). Used for customer-ready and internal reports. */
export declare function renderHtml(r: Report): string;
/** Tiny Markdown → HTML for our own controlled output (headings, tables, quotes, code, lists, bold, links). */
export declare function mdToHtml(md: string): string;
