import Sandbox from '@e2b/code-interpreter'

async function createSandbox() {
    try {
        const template = 'nextjs-developer-1760834380035'

        const sbx = await Sandbox.create(template, {
            // nextjs-developer
            metadata: {
                template: template,
            },
            timeoutMs: 36_00_000,
        })

        console.log('Sandbox created', sbx.sandboxId)
    } catch (error) {
        console.error('Failed to create sbx', error)
    }
}

createSandbox()
