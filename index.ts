import { writeFileSync } from 'fs'

// const filteredFolders = [
//     { name: 'README.md', path: '/home/user/README.md', type: 'file' },
//     {
//         name: 'components.json',
//         path: '/home/user/components.json',
//         type: 'file',
//     },
//     { name: 'next-env.d.ts', path: '/home/user/next-env.d.ts', type: 'file' },
//     { name: 'next.config.ts', path: '/home/user/next.config.ts', type: 'file' },
//     {
//         name: 'package-lock.json',
//         path: '/home/user/package-lock.json',
//         type: 'file',
//     },
//     { name: 'package.json', path: '/home/user/package.json', type: 'file' },
//     {
//         name: 'postcss.config.mjs',
//         path: '/home/user/postcss.config.mjs',
//         type: 'file',
//     },
//     { name: 'public', path: '/home/user/public', type: 'dir' },
//     { name: 'file.svg', path: '/home/user/public/file.svg', type: 'file' },
//     { name: 'globe.svg', path: '/home/user/public/globe.svg', type: 'file' },
//     { name: 'next.svg', path: '/home/user/public/next.svg', type: 'file' },
//     { name: 'vercel.svg', path: '/home/user/public/vercel.svg', type: 'file' },
//     { name: 'window.svg', path: '/home/user/public/window.svg', type: 'file' },
//     { name: 'src', path: '/home/user/src', type: 'dir' },
//     { name: 'app', path: '/home/user/src/app', type: 'dir' },
//     {
//         name: 'favicon.ico',
//         path: '/home/user/src/app/favicon.ico',
//         type: 'file',
//     },
//     {
//         name: 'globals.css',
//         path: '/home/user/src/app/globals.css',
//         type: 'file',
//     },
//     { name: 'layout.tsx', path: '/home/user/src/app/layout.tsx', type: 'file' },
//     { name: 'page.tsx', path: '/home/user/src/app/page.tsx', type: 'file' },
//     { name: 'components', path: '/home/user/src/components', type: 'dir' },
//     { name: 'ui', path: '/home/user/src/components/ui', type: 'dir' },
//     { name: 'hooks', path: '/home/user/src/hooks', type: 'dir' },
//     {
//         name: 'use-mobile.tsx',
//         path: '/home/user/src/hooks/use-mobile.tsx',
//         type: 'file',
//     },
//     { name: 'lib', path: '/home/user/src/lib', type: 'file' },
//     { name: 'utils.ts', path: '/home/user/src/lib/utils.ts', type: 'file' },
//     {
//         name: 'tailwind.config.ts',
//         path: '/home/user/tailwind.config.ts',
//         type: 'file',
//     },
//     { name: 'tsconfig.json', path: '/home/user/tsconfig.json', type: 'file' },
// ]

type File = { label: string; path: string; type: 'file' }
type Folder = {
    label: string
    path: string
    type: 'folder'
    children: (File | Folder)[]
}

type Tree = (File | Folder)[]

function buildTree(files: typeof filteredFolders) {
    const tree: Tree = []

    files.forEach((file) => {
        const path = file.path

        let currentChildren: Tree = tree

        const tokens = path.split('/') // ["home", "user", "app"]

        tokens.forEach((token, index) => {
            if (!token.length) return

            const pathForToken = [...tokens].splice(0, index + 1).join('/') // [/home/user/app]

            // console.log(tree)

            if (index + 1 === tokens.length && file.type === 'file') {
                return currentChildren.push({
                    type: 'file',
                    label: 'token',
                    path: pathForToken,
                })
            }

            // console.log('path for token', pathForToken)

            const folderInCurrentChildren = currentChildren.find(
                (folder) =>
                    folder.path === pathForToken && folder.type === 'folder'
            )

            if (folderInCurrentChildren?.type === 'file')
                throw new Error("Shouldn't be a file")

            if (folderInCurrentChildren) {
                console.log('folder already exists')
                currentChildren = folderInCurrentChildren.children
                return
            }

            const children: Tree = []

            // console.log('creating new folder')

            const newFolder: Folder = {
                type: 'folder',
                path: pathForToken,
                label: token,
                children,
            }

            currentChildren.push(newFolder)

            currentChildren = children
        })
    })

    console.log(tree)

    return tree
}

const test = [{ name: 'app', path: '/home/user/app', type: 'folder' }]

const tree = buildTree(test)

writeFileSync('updated-structure.json', JSON.stringify(tree))

// console.dir(tree, { depth: null })
