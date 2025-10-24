import { excludedNames, excludedPaths } from '@/data/data'
import {
    doesChildAlreadyExists,
    getRemainingPath,
    isAFile,
    splitPathSegments,
} from '@/lib/utils'

export interface updatedFileStructure {
    id: string
    label: string
    path: string
    children?: updatedFileStructure[]
    type: 'file' | 'dir'
}

const fileStructure: updatedFileStructure[] = []
const basePath = '/home/user/'

interface fileStructure {
    name: string
    type: 'file' | 'dir'
    path: string
}

function addChildNodes(
    currentNode: updatedFileStructure,
    remainingPath: string,
) {
    const pathSegments = splitPathSegments(remainingPath)
    if (!pathSegments.length) return currentNode

    const currentChild = pathSegments.at(0)!
    const existingChild = doesChildAlreadyExists(currentChild, currentNode)
    const nextPath = getRemainingPath(pathSegments)

    const isAFileChild = isAFile(currentChild)

    if (!existingChild) {
        const newChildNode: updatedFileStructure = {
            id: crypto.randomUUID(),
            label: currentChild,
            path: `${currentNode.path}/${currentChild}`,
            type: isAFileChild ? 'file' : 'dir',
        }

        if (!isAFile(currentChild)) newChildNode['children'] = []

        currentNode.children?.push(newChildNode)
        addChildNodes(newChildNode, nextPath)
        return currentNode
    }

    addChildNodes(existingChild, nextPath)
    return currentNode
}

export function buildFolderTree(files: any[]) {
    fileStructure.length = 0

    files
        .filter(
            (file) =>
                !excludedPaths.some((p) => file.path.includes(p)) &&
                !excludedNames.includes(file.name),
        )
        .forEach((file) => {
            if (file.type === 'file') {
                const absoluteFilePath = file.path

                if (!absoluteFilePath.includes(basePath))
                    return console.error('Base path not found')

                const relativePath = absoluteFilePath
                    .split(basePath)
                    .slice(1)
                    .at(0)

                if (!relativePath) return console.error('File path not found')

                const doesFileAlreadyExists = fileStructure.find(
                    (e) => e.label === file.name,
                )

                if (relativePath === file.name && !doesFileAlreadyExists) {
                    fileStructure.push({
                        id: crypto.randomUUID(),
                        label: file.name,
                        path: file.path,
                        type: file.type,
                    })
                } else {
                    const fullPathSegments = relativePath.split('/')
                    const remainingPath = getRemainingPath(fullPathSegments)

                    if (!remainingPath) return

                    const rootFolderName = fullPathSegments.at(0)!

                    const existingRootFolder = fileStructure.find(
                        (e) => e.label === rootFolderName,
                    )

                    const splittedPath = splitPathSegments(file.path)

                    const index = splittedPath.findIndex(
                        (i) => i === rootFolderName,
                    )

                    const path = splittedPath.slice(0, index + 1).join('/')

                    if (!existingRootFolder) {
                        const newRootFolder = {
                            id: crypto.randomUUID(),
                            label: rootFolderName,
                            path: path,
                            children: [],
                            type: 'dir' as 'file' | 'dir',
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

                const rootFolder = pathSegments[0]
                const childPath = pathSegments.slice(1).join('/')

                const doesRootFolderExists = fileStructure.find((a) => {
                    return a.label === rootFolder
                })

                if (!doesRootFolderExists) {
                    const filePath = splitPathSegments(file.path)
                    const rootIndex = filePath.findIndex(
                        (e) => e === rootFolder,
                    )
                    const path = filePath.slice(0, rootIndex + 1).join('/')

                    const newFolderNode = {
                        id: crypto.randomUUID(),
                        label: rootFolder,
                        path: path,
                        type: 'dir' as 'file' | 'dir',
                        children: [],
                    }

                    fileStructure.push(newFolderNode)
                    addChildNodes(newFolderNode, childPath)

                    return
                }

                addChildNodes(doesRootFolderExists, childPath)
            }
        })

    return fileStructure
}
