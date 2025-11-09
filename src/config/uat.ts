import { Config } from "./type";

export const config: Config = {
    version: 'v2.0.1',
    environment: 'uat',
    apiUrl: 'https://uat-api.example.com',
    features: {
        debugging: true,
        analytics: true
    }
};