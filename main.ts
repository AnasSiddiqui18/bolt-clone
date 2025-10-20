import { writeFileSync } from 'fs'

const filteredFolders = [
    { name: 'README.md', path: '/home/user/README.md', type: 'file' },
    {
        name: 'components.json',
        path: '/home/user/components.json',
        type: 'file',
    },
    { name: 'next-env.d.ts', path: '/home/user/next-env.d.ts', type: 'file' },
    { name: 'next.config.ts', path: '/home/user/next.config.ts', type: 'file' },
    {
        name: 'package-lock.json',
        path: '/home/user/package-lock.json',
        type: 'file',
    },
    { name: 'package.json', path: '/home/user/package.json', type: 'file' },
    {
        name: 'postcss.config.mjs',
        path: '/home/user/postcss.config.mjs',
        type: 'file',
    },
    { name: 'public', path: '/home/user/public', type: 'dir' },
    { name: 'file.svg', path: '/home/user/public/file.svg', type: 'file' },
    { name: 'globe.svg', path: '/home/user/public/globe.svg', type: 'file' },
    { name: 'next.svg', path: '/home/user/public/next.svg', type: 'file' },
    { name: 'vercel.svg', path: '/home/user/public/vercel.svg', type: 'file' },
    { name: 'window.svg', path: '/home/user/public/window.svg', type: 'file' },
    { name: 'src', path: '/home/user/src', type: 'dir' },
    { name: 'app', path: '/home/user/src/app', type: 'dir' },
    {
        name: 'favicon.ico',
        path: '/home/user/src/app/favicon.ico',
        type: 'file',
    },
    {
        name: 'globals.css',
        path: '/home/user/src/app/globals.css',
        type: 'file',
    },
    { name: 'layout.tsx', path: '/home/user/src/app/layout.tsx', type: 'file' },
    { name: 'page.tsx', path: '/home/user/src/app/page.tsx', type: 'file' },
    { name: 'components', path: '/home/user/src/components', type: 'dir' },
    { name: 'ui', path: '/home/user/src/components/ui', type: 'dir' },
    { name: 'hooks', path: '/home/user/src/hooks', type: 'dir' },
    {
        name: 'use-mobile.tsx',
        path: '/home/user/src/hooks/use-mobile.tsx',
        type: 'file',
    },
    { name: 'lib', path: '/home/user/src/lib', type: 'file' },
    { name: 'utils.ts', path: '/home/user/src/lib/utils.ts', type: 'file' },
    {
        name: 'tailwind.config.ts',
        path: '/home/user/tailwind.config.ts',
        type: 'file',
    },
    { name: 'tsconfig.json', path: '/home/user/tsconfig.json', type: 'file' },
] as const

interface fileStructure {
    name: string
    type: 'file' | 'dir'
    path: string
}

interface updatedFileStructure {
    id: string
    name: string
    children?: updatedFileStructure[]
}

const fileStructure: updatedFileStructure[] = []
const basePath = '/home/user/'

const splitPathSegments = (path: string) =>
    path.split('/').filter((segment) => segment.trim())

const getRemainingPath = (segments: string[]) => segments.slice(1).join('/')

const doesChildAlreadyExists = (
    label: string,
    parentNode: updatedFileStructure
) => {
    if (!parentNode.children) return null
    return parentNode.children.find((a) => a.name === label)
}

const filesEx = [
    // Code files
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.rs',
    '.py',
    '.go',
    '.java',
    '.cpp',
    '.c',
    '.cs',
    '.swift',
    '.rb',
    '.php',

    // Config files
    '.config.ts',
    '.config.js',
    '.config.mjs',
    '.config.cjs',
    '.json',
    '.yaml',
    '.yml',
    '.toml',
    '.ini',

    // Markdown & docs
    '.md',
    '.MD',
    '.mdx',
    '.txt',
    '.log',
    '.csv',

    // Style files
    '.css',
    '.scss',
    '.sass',
    '.less',
    '.styl',

    // Environment & ignore files
    '.env',
    '.env.local',
    '.env.development',
    '.env.production',
    '.gitignore',
    '.gitattributes',

    // Build / meta files
    '.lock',
    '.lockb',
    '.babelrc',
    '.eslintrc',
    '.prettierrc',
    '.editorconfig',

    // Binary / media files
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.webp',
    '.avif',
    '.mp3',
    '.mp4',
    '.mov',
    '.wav',
    '.webm',
    '.pdf',
    '.zip',
    '.tar',
    '.gz',

    // Misc
    '.dockerfile',
    '.dockerignore',
    '.sh',
    '.bat',
    '.ps1',
]

const isAFile = (fileName: string) => {
    return filesEx.some((file) => fileName.includes(file))
}

function addChildNodes(
    currentNode: updatedFileStructure,
    remainingPath: string // src/components
) {
    console.log('add child function runs')

    const pathSegments = splitPathSegments(remainingPath) // ['src', 'components']
    if (!pathSegments.length) return currentNode

    const currentChild = pathSegments.at(0)!
    const existingChild = doesChildAlreadyExists(currentChild, currentNode)
    const nextPath = getRemainingPath(pathSegments)

    if (!existingChild) {
        const newChildNode: updatedFileStructure = {
            id: crypto.randomUUID(),
            name: currentChild,
        }

        if (!isAFile(currentChild)) newChildNode['children'] = []

        currentNode.children?.push(newChildNode) // tailwind.config.ts
        addChildNodes(newChildNode, nextPath)
        return currentNode
    }

    console.log('already exists', nextPath)
    addChildNodes(existingChild, nextPath)
    return currentNode
}

function buildFolderTree(files: fileStructure[]) {
    files.forEach((file) => {
        if (file.type === 'file') {
            const absoluteFilePath = file.path

            if (!absoluteFilePath.includes(basePath))
                return console.error('Base path not found')

            const relativePath = absoluteFilePath.split(basePath).slice(1).at(0)
            if (!relativePath) return console.error('File path not found')

            if (relativePath[0] === file.name) {
                fileStructure.push({ id: crypto.randomUUID(), name: file.name })
            } else {
                const fullPathSegments = relativePath.split('/')
                const remainingPath = getRemainingPath(fullPathSegments)
                const rootFolderName = fullPathSegments.at(0)!

                const existingRootFolder = fileStructure.find(
                    (e) => e.name === rootFolderName
                )

                if (!existingRootFolder) {
                    const newRootFolder = {
                        id: crypto.randomUUID(),
                        name: rootFolderName,
                        children: [],
                    }

                    fileStructure.push(newRootFolder)
                    addChildNodes(newRootFolder, remainingPath)
                    return
                }

                addChildNodes(existingRootFolder, remainingPath)
            }
        } else {
            if (!file.path.includes(basePath))
                return console.error('Base path not found')

            const relativePathParts = file.path.split(basePath).slice(1)
            const pathSegments = relativePathParts.at(0)?.split('/')!
            // prettier-ignore

            const rootFolder = pathSegments[0]
            const childPath = pathSegments.slice(1).join('/')

            const doesRootFolderExists = fileStructure.find((a) => {
                return a.name === rootFolder
            })

            if (!doesRootFolderExists && pathSegments.length) {
                // root folder doesn't exists

                const newFolderNode = {
                    id: crypto.randomUUID(),
                    name: rootFolder,
                    children: [],
                }

                fileStructure.push(newFolderNode)
                addChildNodes(newFolderNode, childPath)

                return
            } else if (pathSegments.length && doesRootFolderExists) {
                // console.log('root found... using the reference')

                const childPath = pathSegments.slice(1).join('/')
                addChildNodes(doesRootFolderExists, childPath)
            }
        }
    })

    return fileStructure
}

const test = [
    {
        name: 'components',
        path: '/home/user/todo-app/src/app',
        type: 'dir',
    },
] as const

const file = buildFolderTree([...test])

writeFileSync('test.json', JSON.stringify(file))

// Todo when adding nested folders things are breaking '/home/user/todo-app/src/components'
