import { Template, defaultBuildLogger } from 'e2b'
import { template } from './template'

async function main() {
    await Template.build(template, {
        alias: 'nextjs-developer-' + Date.now(), // unique each time
        onBuildLogs: defaultBuildLogger(),
        cpuCount: 4,
        memoryMB: 4096,
    })
}

main().catch(console.error)
