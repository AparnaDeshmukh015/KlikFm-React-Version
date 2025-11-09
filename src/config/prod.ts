import { Config } from "./type";

export const config: Config = {
    version: 'v2.0.1',
    environment: 'production',
    apiUrl: 'https://api.example.com',
    features: {
        debugging: false,
        analytics: true
    }
};