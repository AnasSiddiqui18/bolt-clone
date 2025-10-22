import { updatedFileStructure } from '@/main'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { filesEx } from '@/data/data'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const splitPathSegments = (path: string) =>
    path.split('/').filter((segment) => segment.trim())

export const getRemainingPath = (segments: string[]) =>
    segments.slice(1).join('/')

export const isAFile = (fileName: string) => {
    return filesEx.some((file) => fileName.includes(file))
}

export const doesChildAlreadyExists = (
    label: string,
    parentNode: updatedFileStructure
) => {
    if (!parentNode.children) return null
    return parentNode.children.find((a) => a.label === label)
}

export function isFileInArray(file: File, existingFiles: File[]) {
    return existingFiles.some(
        (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.type === file.type
    )
}

export function addChildNodes(
    currentNode: updatedFileStructure,
    remainingPath: string // src/components
) {
    console.log('add child function runs')

    const pathSegments = splitPathSegments(remainingPath) // ['src', 'components']
    if (!pathSegments.length) return currentNode

    const currentChild = pathSegments.at(0)!
    const existingChild = doesChildAlreadyExists(currentChild, currentNode)
    const nextPath = getRemainingPath(pathSegments)

    console.log('nextPath', nextPath)

    if (!existingChild) {
        const newChildNode: updatedFileStructure = {
            id: crypto.randomUUID(),
            label: currentChild,
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
