import { first, num, perDay, rows } from './base.js';
import { pillarDailyGb } from '../units/calculator.js';
/** Average billed bytes per log record = usage GB/day ÷ log count/day (both measured, no assumptions). */
export async function logBaseline(ctx) {
    if (ctx.shared.has('logBaseline'))
        return ctx.shared.get('logBaseline');
    const e = await ctx.query('LOG-BASELINE', 'log-count');
    const r = first(e);
    const count = perDay(num(r.log_count), e.window);
    const bodyBytes = perDay(num(r.body_bytes), e.window);
    const gb = pillarDailyGb(ctx.usage, 'logs');
    const b = { count, bodyBytes, gbPerDay: gb, bytesPerLog: gb && count ? (gb * 1e9) / count : null, ev: e };
    ctx.shared.set('logBaseline', b);
    return b;
}
export async function spanBaseline(ctx) {
    if (ctx.shared.has('spanBaseline'))
        return ctx.shared.get('spanBaseline');
    const e = await ctx.query('SPAN-BASELINE', 'span-count');
    const k = await ctx.query('SPAN-BASELINE', 'kind-split');
    const count = perDay(num(first(e).spans), e.window);
    const gb = pillarDailyGb(ctx.usage, 'traces');
    const kinds = {};
    for (const r of rows(k))
        kinds[String(r.kind)] = perDay(num(r.spans), k.window);
    const b = { count, gbPerDay: gb, bytesPerSpan: gb && count ? (gb * 1e9) / count : null, ev: e, kinds };
    ctx.shared.set('spanBaseline', b);
    return b;
}
export const isCritical = (ctx, svc) => ctx.customer.criticalServices.map((s) => s.toLowerCase()).includes(String(svc).toLowerCase());
//# sourceMappingURL=shared.js.map