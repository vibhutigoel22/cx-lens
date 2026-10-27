const OUTPUT_CONTRACT = `Return ONLY JSON: {"findings":[{"title":"...","plain":"1-2 plain sentences","detail":"...","unitsPerDay":number|null,"gbPerDay":number|null,"phase":1|2|3,"effort":"low|medium|medium-high","owner":"DevOps|App Team","nextStep":"...","configSnippet":"yaml or empty","evidence":"short text"}]}`;
export function skillAnalyzer(m, runner) {
    return {
        id: `SKILL-${m.id}`, pillar: m.pillar, deploymentTypes: ['helm', 'ecs', 'ec2', 'standalone'], title: m.title,
        defaultPhase: 1, defaultEffort: 'low', owner: 'DevOps', verifyChecklist: ['Review the skill output with the customer before acting.'], overlapsWith: [],
        sources: [{ title: `TAM skill: ${m.id}`, url: '', internal: true }],
        async detect(ctx) {
            const prompt = `${m.prompt ?? 'Run your analysis for this Coralogix team.'}\nCustomer: ${ctx.customer.environment}. Critical services: ${ctx.customer.criticalServices.join(', ') || 'none'}.\n${OUTPUT_CONTRACT}`;
            const out = await runner.runSkill(m.path, prompt);
            if (!out)
                return { applicable: false, skippedReason: 'claude CLI not available', evidence: [], facts: {} };
            let parsed;
            try {
                parsed = JSON.parse(out.text.replace(/```json|```/g, '').trim());
            }
            catch {
                return { applicable: false, skippedReason: 'Skill output was not valid JSON', evidence: [], facts: { raw: out.text.slice(0, 2000) } };
            }
            return (parsed.findings ?? []).map((f) => ({ applicable: true, evidence: [{ id: m.id, language: 'dataprime', pillar: 'logs', text: 'skill', window: '-', limit: 0, rows: [{ evidence: f.evidence }] }], facts: f, phaseOverride: f.phase, forceStatus: 'candidate' }));
        },
        recommend: (d) => ({ title: d.facts.title, plain: d.facts.plain, detail: d.facts.detail, nextStep: d.facts.nextStep ?? 'Review with the customer.' }),
        generateConfigPatch: (d) => (d.facts.configSnippet ? { summary: d.facts.title, snippet: d.facts.configSnippet, ops: [] } : undefined),
        estimateSavings: (d) => (typeof d.facts.unitsPerDay === 'number' ? { kind: 'units', unitsPerDay: d.facts.unitsPerDay, gbPerDay: d.facts.gbPerDay ?? null, basis: `Reported by skill ${m.id}` } : { kind: 'needs-scoping', unitsPerDay: null, gbPerDay: null, basis: `Skill ${m.id} did not quantify` }),
    };
}
//# sourceMappingURL=skill-analyzer.js.map