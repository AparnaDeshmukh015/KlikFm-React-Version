interface Config {
    version: string;
    environment: 'development' | 'production' | 'uat';
    apiUrl: string;
    features?: {
        debugging?: boolean;
        analytics?: boolean;
    };
}

export type { Config };