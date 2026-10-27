/** JSON Schema Claude must follow (enforced with `claude -p --json-schema`). */
export const ANALYSIS_SCHEMA = {
    type: 'object', required: ['contributors'],
    properties: { contributors: { type: 'array', items: { type: 'object',
                required: ['key', 'what_it_is', 'value', 'action', 'title', 'why_it_matters', 'dataprime_filter', 'next_step', 'verify_questions', 'confidence'],
                properties: {
                    key: { type: 'string', description: 'The contributor key exactly as given.' },
                    title: { type: 'string', description: 'Short imperative title, e.g. "Drop load-generator redirect access logs".' },
                    what_it_is: { type: 'string', description: 'One or two plain sentences: what these records are.' },
                    value: { enum: ['high', 'medium', 'low'], description: 'Troubleshooting/alerting value of the records the change affects.' },
                    signals: { type: 'array', items: { type: 'string' }, description: 'Concrete evidence from the samples (quote short fragments).' },
                    action: { enum: ['drop', 'sample', 'truncate', 'replace', 'delete_attribute', 'move_tier', 'fix_at_source', 'keep'] },
                    why_it_matters: { type: 'string', description: 'One or two plain sentences for a non-technical reader.' },
                    dataprime_filter: { type: 'string', description: 'DataPrime boolean expression selecting exactly the records the change affects.' },
                    ottl_condition: { type: 'string', description: 'For drop/sample: OTTL boolean condition (filter processor).' },
                    ottl_statements: { type: 'array', items: { type: 'string' }, description: 'For truncate/replace/delete_attribute: OTTL statements (transform processor).' },
                    regex: { type: 'string', description: 'For replace: the RE2 pattern used in replace_pattern (Lens simulates it on the samples).' },
                    replacement: { type: 'string', description: 'For replace: the replacement string.' },
                    truncate_to: { type: 'integer', description: 'For truncate: max body length in characters.' },
                    sample_percent: { type: 'number', description: 'For sample: percent of matching records to keep.' },
                    tier: { enum: ['medium', 'low'], description: 'For move_tier.' },
                    attribute: { type: 'string', description: 'For delete_attribute: attribute key.' },
                    source_fix: { type: 'string', description: 'For fix_at_source: what to change in the app or shipper.' },
                    next_step: { type: 'string' },
                    verify_questions: { type: 'array', items: { type: 'string' } },
                    confidence: { enum: ['high', 'medium', 'low'] },
                } } } },
};
export const SYSTEM_RULES = (o) => `You are a Coralogix telemetry optimisation expert helping a TAM. You analyse REAL, masked telemetry samples and propose ONE concrete, safe change per contributor that reduces cost without losing troubleshooting or alerting value.

Hard rules:
- Never propose removing these protected resource attributes: ${o.protectedLabels.join(', ')}.
- Never drop or sample ERROR/CRITICAL records. Conditions must exclude them (for logs: severity_number < SEVERITY_NUMBER_ERROR, or match only non-error content).
- Use only OpenTelemetry Collector contrib components and OTTL functions from the official docs: filter processor, transform processor; OTTL functions replace_pattern, replace_all_patterns, delete_key, delete_matching_keys, set, truncate_all, Substring, Len, IsMatch, Concat. No other processors.
- Filter conditions (ottl_condition) ${o.conditionsSyntax ? 'use context-prefixed paths for log_conditions/trace_conditions: log.body, log.attributes["k"], log.severity_number, resource.attributes["k"], span.name, span.attributes["k"], span.kind.string, span.status.code' : 'use legacy unprefixed paths (body, attributes["k"], severity_number, name, kind.string, status.code) because the collector is older than 0.146.0'}.
- Transform statements (ottl_statements) use the context-block form with UNPREFIXED paths: body, attributes["k"], resource.attributes["k"]. Example: replace_pattern(body, "\\\\[trace_id=[0-9a-f]+ span_id=[0-9a-f]+[^\\\\]]*\\\\] ", "")
- dataprime_filter must be a valid Coralogix DataPrime boolean expression over the same records. Use only these forms: $d.body:string.contains('x'), $d.body:string.startsWith('x'), $l.subsystemname == 'x', $l.applicationname == 'x', $m.templateid == 'x', $m.severity == INFO (logs); $l.serviceName == 'x', $l.operationName == 'x', $d.tags['k']:string == 'x' (spans). Combine with && and ||. Single-quote strings.
- Prefer, in order: fix_at_source (if the app/shipper is clearly misbehaving, e.g. duplicate collection), replace/truncate (keep the record, remove the waste), drop (pure noise), sample, move_tier (retain but rarely searched), keep (valuable; explain why).
- Be specific to what the samples show. Quote short fragments as evidence. Do not invent numbers: Lens measures volume and savings itself.
${o.collectorVersion ? `Collector version: ${o.collectorVersion}.` : ''}
Return JSON only, matching the schema.`;
//# sourceMappingURL=schema.js.map