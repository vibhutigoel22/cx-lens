const token = () => document.querySelector<HTMLMetaElement>('meta[name="cxlens-token"]')?.content ?? (window as any).__CXLENS_TOKEN__ ?? '';
let base = (window as any).__CXLENS_API__ ?? '';
export const setApiBase = (b: string) => { base = b; };
export async function api<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const r = await fetch(base + path, { ...init, headers: { 'content-type': 'application/json', 'X-CxLens-Token': token(), ...(init.headers ?? {}) } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error ?? `Request failed (${r.status})`);
  return j as T;
}
export function watchRun(id: string, on: (m: any) => void): () => void {
  const u = new URL(base || location.href); u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:'; u.pathname = '/ws'; u.search = `?run=${id}&token=${token()}`;
  const ws = new WebSocket(u); ws.onmessage = (e) => on(JSON.parse(e.data)); return () => ws.close();
}
export function download(name: string, text: string) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: name.endsWith('.html') ? 'text/html' : name.endsWith('.json') ? 'application/json' : 'text/plain' })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
/** POST and save the binary response (e.g. a zip), using the server's file name. */
export async function downloadPost(path: string, body: unknown, fallbackName: string) {
  const r = await fetch(base + path, { method: 'POST', headers: { 'content-type': 'application/json', 'X-CxLens-Token': token() }, body: JSON.stringify(body) });
  if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.error ?? `Download failed (${r.status})`); }
  const cd = r.headers.get('content-disposition') ?? ''; const m = cd.match(/filename\*=UTF-8''([^;]+)/) ?? cd.match(/filename="([^"]+)"/);
  const name = m ? decodeURIComponent(m[1]) : fallbackName;
  const a = document.createElement('a'); a.href = URL.createObjectURL(await r.blob()); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  return name;
}
