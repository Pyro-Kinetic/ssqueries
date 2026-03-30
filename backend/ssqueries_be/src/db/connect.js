import pg from 'pg';

const {Pool} = pg

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : false // required for render
})

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
    process.exit(1)
})

export function getDBConnection() {
    return pool;
}
    