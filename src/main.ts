// Runtime environment variables are overwritten by .env
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env', override: true })

import bootstrap from 'app/app.bootstrap'
bootstrap().catch(console.error)
