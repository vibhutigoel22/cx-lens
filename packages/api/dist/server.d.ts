import { IncomingMessage, ServerResponse } from 'node:http';
export declare function start(port?: number): import("http").Server<typeof IncomingMessage, typeof ServerResponse>;
