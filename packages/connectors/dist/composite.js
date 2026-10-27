/** One Connector the engine uses: cx for queries/usage, Metrics API for series, claude for AI review. */
export class CompositeConnector {
    cx;
    metrics;
    claude;
    id;
    askAI;
    metricUsage;
    constructor(cx, metrics, claude) {
        this.cx = cx;
        this.metrics = metrics;
        this.claude = claude;
        this.id = ['cx-cli', metrics && 'metrics-api-fallback', claude?.available() && 'claude-cli'].filter(Boolean).join('+');
        if (claude?.available())
            this.askAI = (prompt, sample, o) => claude.ask(sample ? `${prompt}\n\nMasked sample:\n${sample}` : prompt, [], o?.schema);
    }
    async healthCheck() { const c = await this.cx.healthCheck(); return { ok: c.ok, detail: c.detail, capabilities: [...c.capabilities, ...(this.metrics ? ['metrics-api-fallback'] : [])] }; }
    listTeams() { return this.cx.listTeams(); }
    runQuery(q) { return this.cx.runQuery(q); }
    getUsageStats(days) { return this.cx.getUsageStats(days); }
    /** Metrics go through cx first (its own sign-in). The direct Metrics API is only a fallback when a key was given explicitly. */
    async getLabelValues(label, window, metric, at) {
        try {
            return await this.cx.getLabelValues(label, window, metric, at);
        }
        catch (e) {
            if (this.metrics)
                return this.metrics.getLabelValues(label, window, metric, at);
            throw e;
        }
    }
    async getMetricSeries(req) {
        try {
            return await this.cx.getMetricSeries(req);
        }
        catch (e) {
            if (this.metrics)
                return this.metrics.getMetricSeries(req);
            throw e;
        }
    }
    promql(expr, at) { return this.cx.promql(expr, at); }
    listResources(kind) { return this.cx.listResources(kind); }
}
//# sourceMappingURL=composite.js.map