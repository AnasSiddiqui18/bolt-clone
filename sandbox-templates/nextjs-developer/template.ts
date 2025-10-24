import { Template, waitForPort } from 'e2b'

export const template = Template()
    .fromNodeImage('24-slim')
    .aptInstall('curl')
    .setWorkdir('/home/user/nextjs-app')
    .runCmd(
        'npx create-next-app@15.1.3 . --ts --tailwind --no-eslint --import-alias "@/*" --use-npm --no-app --src-dir --app --yes',
    )
    .runCmd('npx shadcn@latest init -d')
    .runCmd('npx shadcn@latest add --all')
    .runCmd(
        'mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app',
    )
    .setWorkdir('/home/user')
    .setStartCmd('npx next --turbo', waitForPort(3000))
