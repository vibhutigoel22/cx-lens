export const openapi = {
    openapi: '3.0.3',
    info: { title: 'Coralogix Lens local API', version: '1.0.0', description: 'Local-only (127.0.0.1) API for the Coralogix Lens engine. All calls require the X-CxLens-Token header issued at startup. Read-only toward Coralogix.' },
    servers: [{ url: 'http://127.0.0.1:4317' }],
    components: {
        securitySchemes: { token: { type: 'apiKey', in: 'header', name: 'X-CxLens-Token' } },
        schemas: {
            Customer: { type: 'object', required: ['name', 'environment'], properties: { name: { type: 'string' }, environment: { type: 'string' }, preparedBy: { type: 'string' }, criticalServices: { type: 'array', items: { type: 'string' } }, nearRenewal: { type: 'boolean' }, teamCanVerify: { type: 'boolean' }, internalTerms: { type: 'array', items: { type: 'string' } } } },
            AssessRequest: { type: 'object', required: ['customer', 'pillars'], properties: { team: { type: 'string', description: 'cx profile name' }, region: { type: 'string' }, demo: { type: 'boolean' }, customer: { $ref: '#/components/schemas/Customer' }, pillars: { type: 'array', items: { enum: ['universal', 'logs', 'traces', 'metrics'] } }, deployment: { enum: ['helm', 'ecs', 'ec2', 'standalone'] }, configText: { type: 'string' }, chartVersion: { type: 'string' }, otelVersion: { type: 'string' }, options: { type: 'object' } } },
            FindingPatch: { type: 'object', properties: { verifyStatus: { enum: ['candidate', 'verified', 'rejected', 'needs-scoping'] }, progress: { enum: ['not-started', 'in-progress', 'done', 'pending'] } } },
            Report: { type: 'object', description: 'See packages/core/schema/report.schema.json' },
        },
    },
    security: [{ token: [] }],
    paths: {
        '/api/health': { get: { summary: 'Tool status (cx, claude, Metrics API) and latest versions', responses: { 200: { description: 'ok' } } } },
        '/api/versions': { get: { summary: 'Latest Helm chart and OTel Collector (24h cache)', parameters: [{ name: 'refresh', in: 'query', schema: { type: 'boolean' } }], responses: { 200: { description: 'ok' } } } },
        '/api/teams': { get: { summary: 'List cx profiles', responses: { 200: { description: 'ok' } } }, post: { summary: 'Add a team (key stored in macOS Keychain)', responses: { 201: { description: 'stored' } } } },
        '/api/config/detect': { post: { summary: 'Detect config format and versions', responses: { 200: { description: 'ok' } } } },
        '/api/runs': { post: { summary: 'Start an assessment; progress streams on ws://127.0.0.1:<port>/ws?run=<id>', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AssessRequest' } } } }, responses: { 202: { description: 'run id' } } }, get: { summary: 'List saved runs', responses: { 200: { description: 'ok' } } } },
        '/api/runs/{id}': { get: { summary: 'Get an assessment', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'ok' } } } },
        '/api/runs/{id}/findings/{ruleId}': { patch: { summary: 'Update Verify status or progress', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/FindingPatch' } } } }, responses: { 200: { description: 'ok' } } } },
        '/api/runs/{id}/preview': { post: { summary: 'Live config preview for selected findings (diff rows)', responses: { 200: { description: 'ok' } } } },
        '/api/runs/{id}/outputs': { post: { summary: 'Generate all exports (configs, diffs, breaking changes, drafts, reports)', responses: { 200: { description: 'files map' } } } },
        '/api/drafts': { get: { summary: 'List saved drafts', responses: { 200: { description: 'ok' } } } },
        '/api/drafts/{id}': { get: { summary: 'Load a draft', responses: { 200: { description: 'ok' } } }, put: { summary: 'Save a draft (no secrets are stored)', responses: { 200: { description: 'saved' } } }, delete: { summary: 'Delete a draft', responses: { 200: { description: 'deleted' } } } },
        '/api/runs/{id}/bundle': { post: { summary: 'All reports and configs as one zip named after the customer; {draft:true} watermarks every report', responses: { 200: { description: 'application/zip' } } } },
        '/api/runs/{id}/report': { get: { summary: 'report.json for an audience', parameters: [{ name: 'audience', in: 'query', schema: { enum: ['internal', 'customer'] } }], responses: { 200: { description: 'Report' } } } },
    },
};
//# sourceMappingURL=openapi.js.map