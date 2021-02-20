export class EnvConfig {
    name: string;
    webBaseUrl: string;
    apiBaseUrl: string;
    port: number;
    database: {
        type: any,
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
        useMigrations: boolean;
    };
    documentdb: {
        host: string;
        username?: string;
        password?: string;
    };
    auth: {
        jwtSecret: string,
        jwtLifetime: number; // Lifetime in seconds
    };
    mail: {
        host: string;
        port: number;
        isSecure: boolean;
        user: string;
        password: string;
        fromName: string;
        fromAddress: string;
    }
}