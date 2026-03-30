import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'

// full path to this file
const __filename = fileURLToPath(import.meta.url)
// folder this file is in
const __dirname = path.dirname(__filename)

const currentEnv = process.env.NODE_ENV?.trim() || 'development'
const envFileName = `.env.${currentEnv}`
// go up two levels to get to root,
// then look for .env.dev or .evn.prod
const envFilePath = path.resolve(__dirname, `../../${envFileName}`)

const isProduction = currentEnv === 'production'

if (!isProduction && !fs.existsSync(envFilePath)) {
    throw new Error(`Environment file not found: ${envFileName}`)
}

const result = dotenv.config({
    path: envFilePath,
    override: true
})

if (result.error && !isProduction) {
    throw result.error
}

console.log(`Environment loaded for: ${currentEnv}`)
