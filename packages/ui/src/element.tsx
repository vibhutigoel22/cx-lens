import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';
import { setApiBase } from './api';
import css from './styles.css?inline';
/** <coralogix-lens api="http://127.0.0.1:4319" token="…"> — self-contained web component (shadow DOM). Theme: data-theme="dark" (default), "light" or "system" on the element. */
class CoralogixLensElement extends HTMLElement {
  private root?: Root;
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' }); const style = document.createElement('style'); style.textContent = css.replace(/:root\[([^\]]+)\]/g, ':host([$1])').replace(/:root/g, ':host'); shadow.appendChild(style);
    const mount = document.createElement('div'); shadow.appendChild(mount);
    if (this.getAttribute('api')) setApiBase(this.getAttribute('api')!); if (this.getAttribute('token')) (window as any).__CXLENS_TOKEN__ = this.getAttribute('token');
    this.root = createRoot(mount); this.root.render(<App />);
  }
  disconnectedCallback() { this.root?.unmount(); }
}
if (!customElements.get('coralogix-lens')) customElements.define('coralogix-lens', CoralogixLensElement);
export { CoralogixLensElement };
