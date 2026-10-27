export declare const keychainAvailable: () => boolean;
export declare function setSecret(account: string, secret: string): Promise<void>;
export declare function getSecret(account: string): Promise<string | null>;
export declare function deleteSecret(account: string): Promise<void>;
