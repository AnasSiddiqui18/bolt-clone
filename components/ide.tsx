'use client'

import { useState, useEffect, useRef } from 'react'
import { CodeEditor } from '@/components/code-editor'
import { GitHubImport } from '@/components/github-import'
import { useAuth } from '@/lib/auth'
import { Button } from './ui/button'
import { Github, FolderOpen } from 'lucide-react'
import Spinner from './ui/spinner'
import { TreeView } from './tree-view-component'
import { languages } from '@/data/data'

interface IDEProps {
    sandboxId?: string // Optional sandbox ID for viewing sandbox files
}

interface FileSystemNode {
    label: string
    path: string
    id: string
    children?: FileSystemNode[]
}

export function IDE({ sandboxId }: IDEProps = {}) {
    const { session, loading } = useAuth(
        () => {},
        () => {}
    )

    const [files, setFiles] = useState<FileSystemNode[]>([])

    const alreadyFetchedFilesRef = useRef(false)

    const [selectedFile, setSelectedFile] = useState<{
        path: string
        content: string
    } | null>(null)
    const [showGitHubImport, setShowGitHubImport] = useState(false)
    const isSandboxMode = !!sandboxId

    useEffect(() => {
        async function fetchSbxFiles() {
            if (alreadyFetchedFilesRef.current) return

            const id = 'iqgjpxcgzqz25gmleitvu'

            try {
                alreadyFetchedFilesRef.current = true

                console.log('start fetching files')

                const response = await fetch(`/api/sandbox/${id}/files`)

                if (response.ok) {
                    const data = await response.json()
                    console.log('sandbox filescl', data)
                    setFiles(data.files || [])
                } else {
                    console.error('Failed to fetch sandbox files')
                    setFiles([])
                }
            } catch (error) {
                console.error('Error fetching sandbox files:', error)
                setFiles([])
            }
        }

        fetchSbxFiles()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner />
            </div>
        )
    }

    async function handleSelectFile(path: string) {
        // prettier-ignore
        try {
            const response = await fetch(`/api/sandbox/iqgjpxcgzqz25gmleitvu/files/content?path=${encodeURIComponent(path)}`)
            const relativePath = `.${path.split('/').slice(-1).at(0)?.split('.')[1]}`
            const { content } = await response.json()             
            setSelectedFile({ path: relativePath, content })
        } catch (error) {
            console.error('Error fetching file content:', error)
        }
    }

    async function handleSaveFile(path: string, content: string) {
        if (isSandboxMode && sandboxId) {
            // Save file to sandbox
            await fetch(`/api/sandbox/${sandboxId}/files/content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path, content }),
            })
        } else if (session) {
            // Save file to Supabase
            await fetch('/api/files/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path, content }),
            })
        }
    }

    async function handleCreateFile(path: string, isDirectory: boolean) {
        // File creation in sandbox mode is not supported via this UI
        if (isSandboxMode) {
            console.log('File creation in sandbox mode not supported')
            return
        }

        if (!session) return
        try {
            const response = await fetch('/api/files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    path,
                    isDirectory,
                    content: isDirectory ? '' : '// New file\n',
                }),
            })
            if (response.ok) {
                // await fetchFiles()
            }
        } catch (error) {
            console.error('Error creating file:', error)
        }
    }

    async function handleDeleteFile(path: string) {
        // File deletion in sandbox mode is not supported via this UI
        if (isSandboxMode) {
            console.log('File deletion in sandbox mode not supported')
            return
        }

        if (!session) return
        try {
            const response = await fetch('/api/files', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    path,
                }),
            })
            if (response.ok) {
                // await fetchFiles()
                if (selectedFile?.path === path) {
                    setSelectedFile(null)
                }
            }
        } catch (error) {
            console.error('Error deleting file:', error)
        }
    }

    async function handleImportRepository(repo: any, repoFiles: any[]) {
        if (!session) return
        try {
            // The files have been imported via the GitHubImport component
            // Just refresh the file list to show the newly imported files
            // await fetchFiles()
            setShowGitHubImport(false)
        } catch (error) {
            console.error('Error after repository import:', error)
        }
    }

    if (showGitHubImport) {
        return (
            <div className="h-full p-4 overflow-auto">
                <GitHubImport
                    onImport={handleImportRepository}
                    onClose={() => setShowGitHubImport(false)}
                />
            </div>
        )
    }

    return (
        <div className="flex h-full">
            <div className="w-1/4 border-r">
                <div className="p-2 border-b space-y-2">
                    <Button
                        // onClick={fetchFiles}
                        className="w-full"
                        variant="outline"
                        size="sm"
                    >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        {isSandboxMode
                            ? 'Refresh Sandbox Files'
                            : 'Refresh Files'}
                    </Button>
                    {!isSandboxMode && (
                        <Button
                            onClick={() => setShowGitHubImport(true)}
                            className="w-full"
                            variant="outline"
                            size="sm"
                        >
                            <Github className="h-4 w-4 mr-2" />
                            Import from GitHub
                        </Button>
                    )}
                </div>
                <TreeView
                    data={files}
                    onNodeClick={async (node: any) => {
                        console.log('Clicked:', node.type)
                        if (node.type !== 'file') return
                        const relativePath = node.path.replace('home/user', '')
                        handleSelectFile(relativePath)
                    }}
                    defaultExpandedIds={['1']}
                    className="border-none"
                />
            </div>
            <div className="w-3/4">
                {selectedFile ? (
                    <CodeEditor
                        key={selectedFile.path}
                        code={selectedFile.content}
                        lang={languages[selectedFile.path ?? '.tsx']}
                        onChange={(content) =>
                            handleSaveFile(selectedFile.path, content || '')
                        }
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p>Select a file to view its content</p>
                    </div>
                )}
            </div>
        </div>
    )
}
