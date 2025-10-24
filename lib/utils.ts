import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { filesEx } from '@/data/data'
import { updatedFileStructure } from '@/helpers/helpers'

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
    parentNode: updatedFileStructure,
) => {
    if (!parentNode.children) return null
    return parentNode.children.find((a) => a.label === label)
}

export function isFileInArray(file: File, existingFiles: File[]) {
    return existingFiles.some(
        (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.type === file.type,
    )
}
