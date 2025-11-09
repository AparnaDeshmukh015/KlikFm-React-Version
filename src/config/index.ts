import { version } from 'os';
import { Config } from './type';

const ENV_TARGET: string = process.env.REACT_APP_ENV ?? 'development'; // This gets replaced by build script
const loadConfig: () => Promise<Config> = async () => {
    try {
        let config;
        switch (ENV_TARGET) {
            case 'production':
                config = await import('./prod');
                break;
            case 'staging':
                config = await import('./uat');
                break;
            case 'development':
                config = await import('./dev');
                break;
            default:
                config = await import('./dev');
                break;
        }
        return config.config;
    } catch (error) {
        console.error('Failed to load config:', error);
        // Fallback config
        return {
            version: 'v1.0.0',
            environment: 'development',
            apiUrl: 'https://dev-api.example.com',
        };
    }
};
export default loadConfig;