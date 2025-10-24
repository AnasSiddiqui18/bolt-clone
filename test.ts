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

        // const sbx = await Sandbox.connect('ipnrha25l2mj1b8jshcne')
        // sbx.files.remove('/home/user/src/app.tsx')

        console.log('Sandbox created', sbx.sandboxId)
    } catch (error) {
        console.error('Failed to create sbx', error)
    }
}

createSandbox()
