import { useState } from 'react'
import {
    ChevronDown,
    ChevronRight,
    File as FileIcon,
    Folder,
    Plus,
    Trash2,
    FolderPlus,
} from 'lucide-react'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { TreeView } from './tree-view-component'

export interface FileSystemNode {
    label: string
    path?: string
    id: string
    children?: FileSystemNode[]
}
interface FileTreeProps {
    files: FileSystemNode[]
    onSelectFile: (path: string) => void
    onCreateFile?: (path: string, isDirectory: boolean) => void
    onDeleteFile?: (path: string) => void
}

export function FileTree({
    files,
    onSelectFile,
    onCreateFile,
    onDeleteFile,
}: FileTreeProps) {
    const [newFileName, setNewFileName] = useState('')
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [createType, setCreateType] = useState<'file' | 'folder'>('file')

    // const treeData = [
    //     {
    //         id: '1',
    //         label: 'src',
    //         children: [
    //             {
    //                 id: '1-1',
    //                 label: 'app',
    //                 children: [
    //                     {
    //                         id: '1-1',
    //                         label: 'ui',
    //                         children: [
    //                             {
    //                                 id: '1-1',
    //                                 label: 'button.tsx',
    //                             },
    //                         ],
    //                     },
    //                 ],
    //             },
    //         ],
    //     },
    //     {
    //         id: '2',
    //         label: 'tailwind.config.ts',
    //     },

    //     {
    //         id: '3',
    //         label: 'package.json',
    //     },
    // ]

    return <div className="p-2"></div>
}
