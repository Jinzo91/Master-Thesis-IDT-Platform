const testConfig = {
    type: 'mssql',
    host: 'localhost',
    port: 1434,
    username: 'SA',
    password: 'IDTRocks2019!',
    database: 'idt',
    entities: ['dist/**/**.entity{.ts,.js}'],
    synchronize: false,
    migrationsRun: true,
    migrationsTableName: "migrations_typeorm",
    migrations: ['dist/migration/*.js'],
    cli: {
        migrationsDir: "src/migration"
    },
    options: {
        encrypt: true,
    },
}

module.exports = testConfig;