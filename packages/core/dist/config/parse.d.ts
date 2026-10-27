import { Document, isMap, isSeq } from 'yaml';
import type { DeploymentType, HelmComponent } from '../types.js';
export type ConfigFormat = 'helm-values' | 'collector' | 'other' | 'empty';
export declare const HELM_COMPONENTS: HelmComponent[];
export interface CollectorView {
    name: string;
    basePath: string[];
    receivers: Record<string, any>;
    processors: Record<string, any>;
    exporters: Record<string, any>;
    connectors: Record<string, any>;
    pipelines: Record<string, {
        receivers?: string[];
        processors?: string[];
        exporters?: string[];
    }>;
    presets: Record<string, any>;
}
export interface ParsedConfig {
    format: ConfigFormat;
    text: string;
    doc: Document;
    chartVersion?: string;
    collectorVersion?: string;
    distribution?: 'otelcol' | 'otelcol-contrib';
    deploymentGuess?: DeploymentType;
    views: CollectorView[];
    notes: string[];
    label: string;
}
export declare function parseConfig(text: string): ParsedConfig;
/** Component *types* used (processors/receivers/exporters/connectors), e.g. "filter" from "filter/drop". */
export declare function componentTypesUsed(p: ParsedConfig): Set<string>;
export declare const pipelinesFor: (v: CollectorView, signal: string) => string[];
export { isMap, isSeq };
