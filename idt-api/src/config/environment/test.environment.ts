import { EnvConfig } from "../model/env.config";

export const environment: EnvConfig = {
    name: 'IDT API, TEST',
    webBaseUrl: 'https://vmkrcmar68.in.tum.de',
    apiBaseUrl: 'https://vmkrcmar68.in.tum.de/api',
    port: 3000,
    database: {
        type: "mssql" as "mssql",
        host: `${process.env.HOST_IP}`,
        port: 30012,
        username: 'sa',
        password: `${process.env.MSSQL_PASSWORD}`,
        name: 'idt',
        useMigrations: false,
    },
    documentdb: {
        host: `mongodb://${process.env.HOST_IP}:30013`,
    },
    auth: {
        jwtSecret: '1dfd5ae3-8320-4d7d-9981-ecea07aacec6',
        jwtLifetime: 3600
    },
    mail: {
        host: 'smtp.gmail.com',
        port: 465,
        isSecure: true,
        user: 'idttum@gmail.com',
        password: 'zplvnoitygixgseh',
        fromName: 'Initiative for Digital Transformation',
        fromAddress: 'idttum@gmail.com'
    }
}