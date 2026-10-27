/** JSON Schema Claude must follow (enforced with `claude -p --json-schema`). */
export declare const ANALYSIS_SCHEMA: {
    readonly type: "object";
    readonly required: readonly ["contributors"];
    readonly properties: {
        readonly contributors: {
            readonly type: "array";
            readonly items: {
                readonly type: "object";
                readonly required: readonly ["key", "what_it_is", "value", "action", "title", "why_it_matters", "dataprime_filter", "next_step", "verify_questions", "confidence"];
                readonly properties: {
                    readonly key: {
                        readonly type: "string";
                        readonly description: "The contributor key exactly as given.";
                    };
                    readonly title: {
                        readonly type: "string";
                        readonly description: "Short imperative title, e.g. \"Drop load-generator redirect access logs\".";
                    };
                    readonly what_it_is: {
                        readonly type: "string";
                        readonly description: "One or two plain sentences: what these records are.";
                    };
                    readonly value: {
                        readonly enum: readonly ["high", "medium", "low"];
                        readonly description: "Troubleshooting/alerting value of the records the change affects.";
                    };
                    readonly signals: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                        readonly description: "Concrete evidence from the samples (quote short fragments).";
                    };
                    readonly action: {
                        readonly enum: readonly ["drop", "sample", "truncate", "replace", "delete_attribute", "move_tier", "fix_at_source", "keep"];
                    };
                    readonly why_it_matters: {
                        readonly type: "string";
                        readonly description: "One or two plain sentences for a non-technical reader.";
                    };
                    readonly dataprime_filter: {
                        readonly type: "string";
                        readonly description: "DataPrime boolean expression selecting exactly the records the change affects.";
                    };
                    readonly ottl_condition: {
                        readonly type: "string";
                        readonly description: "For drop/sample: OTTL boolean condition (filter processor).";
                    };
                    readonly ottl_statements: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                        readonly description: "For truncate/replace/delete_attribute: OTTL statements (transform processor).";
                    };
                    readonly regex: {
                        readonly type: "string";
                        readonly description: "For replace: the RE2 pattern used in replace_pattern (Lens simulates it on the samples).";
                    };
                    readonly replacement: {
                        readonly type: "string";
                        readonly description: "For replace: the replacement string.";
                    };
                    readonly truncate_to: {
                        readonly type: "integer";
                        readonly description: "For truncate: max body length in characters.";
                    };
                    readonly sample_percent: {
                        readonly type: "number";
                        readonly description: "For sample: percent of matching records to keep.";
                    };
                    readonly tier: {
                        readonly enum: readonly ["medium", "low"];
                        readonly description: "For move_tier.";
                    };
                    readonly attribute: {
                        readonly type: "string";
                        readonly description: "For delete_attribute: attribute key.";
                    };
                    readonly source_fix: {
                        readonly type: "string";
                        readonly description: "For fix_at_source: what to change in the app or shipper.";
                    };
                    readonly next_step: {
                        readonly type: "string";
                    };
                    readonly verify_questions: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly confidence: {
                        readonly enum: readonly ["high", "medium", "low"];
                    };
                };
            };
        };
    };
};
export declare const SYSTEM_RULES: (o: {
    collectorVersion?: string;
    conditionsSyntax: boolean;
    protectedLabels: string[];
}) => string;
