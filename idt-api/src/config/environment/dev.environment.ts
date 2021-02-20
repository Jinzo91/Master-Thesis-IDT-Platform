import { EnvConfig } from "../model/env.config";

export const environment: EnvConfig = {
    name: 'IDT API, DEV',
    webBaseUrl: 'http://localhost:4200',
    apiBaseUrl: 'http://localhost:3000',
    port: 3000,
    database: { 
        type: "mssql" as "mssql", 
        host: 'localhost', 
        port: 1434, 
        username: 'SA', 
        password: 'IDTRocks2019!', 
        name: 'idt', 
        useMigrations: false, 
    },
    documentdb: {
        host: 'mongodb://localhost:27017',
        // username: 'idt-test',
        // password: '5bDm8hByZQosSlB1uMtkeBXI0rzP00Z8ueyUV6L1RBdsQ6m09ofhkKBQoSx4Ugdt5LLHL6xg2db7P2hYErw5Eg=='
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
        fromName: 'IDT (DEV)',
        fromAddress: 'idttum@gmail.com'
    }
}