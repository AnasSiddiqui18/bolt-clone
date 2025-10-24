import { FragmentCode } from './fragment-code'
import { FragmentPreview } from './fragment-preview'
import { FragmentTerminal } from './fragment-terminal'
import { FragmentInterpreter } from './fragment-interpreter'
import { CodeEditor } from './code-editor'
import { SandboxFileTree } from './sandbox-file-tree'
import { IDE } from './ide'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { FragmentSchema } from '@/lib/schema'
import { ExecutionResult } from '@/lib/types'
import { DeepPartial } from 'ai'
import {
    ChevronsRight,
    LoaderCircle,
    Terminal,
    Code,
    FileCode,
    FolderTree,
    Folder,
    Eye,
} from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useLocalStorage } from '@/hooks/use-locastorage'

export function Preview({
    teamID,
    accessToken,
    selectedTab,
    onSelectedTabChange,
    isChatLoading,
    isPreviewLoading,
    fragment,
    result,
    onClose,
    selectedFile,
    onSelectFile,
    onSave,
    executeCode,
}: {
    teamID: string | undefined
    accessToken: string | undefined
    selectedTab: 'fragment' | 'terminal' | 'files' | 'ide'
    onSelectedTabChange: Dispatch<
        SetStateAction<'fragment' | 'terminal' | 'ide'>
    >
    isChatLoading: boolean
    isPreviewLoading: boolean
    fragment?: DeepPartial<FragmentSchema>
    result?: ExecutionResult
    onClose: () => void
    selectedFile?: { path: string; content: string } | null
    onSelectFile?: (file: { path: string; content: string }) => void
    onSave?: (path: string, content: string) => Promise<void>
    executeCode?: (code: string) => Promise<any>
}) {
    const [isRefreshingFiles, setIsRefreshingFiles] = useState(false)
    const [localStorageRes, setLocalStorageRes] = useState<ExecutionResult>()
    const [showPreview, setShowPreview] = useState(false)

    async function handleSelectSandboxFile(path: string) {
        if (!result?.sbxId) return

        try {
            const response = await fetch(
                `/api/sandbox/${
                    result.sbxId
                }/files/content?path=${encodeURIComponent(path)}`,
            )
            const data = await response.json()

            if (response.ok && data.content !== undefined) {
                // Update the selected file in the parent component
                if (onSelectFile) {
                    onSelectFile({ path: data.path, content: data.content })
                }
            }
        } catch (error) {
            console.error('Error loading sandbox file:', error)
        }
    }

    const [value, setValue] = useLocalStorage('result')

    useEffect(() => {
        if (result) return setValue(JSON.stringify(result))
        if (value) {
            setLocalStorageRes(JSON.parse(value))
        }
    }, [result, value])

    async function handleRefreshFiles() {
        if (!result?.sbxId) return

        setIsRefreshingFiles(true)
        try {
            const response = await fetch(`/api/sandbox/${result.sbxId}/files`)
            const data = await response.json()

            if (response.ok && data.files) {
                // Files refreshed - this would need to update result.files in parent
                console.log('Files refreshed:', data.files)
            }
        } catch (error) {
            console.error('Error refreshing files:', error)
        } finally {
            setIsRefreshingFiles(false)
        }
    }

    return (
        <div className="shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y bg-popover w-full overflow-hidden">
            <div className="w-full p-2 grid grid-cols-3 items-center border-b relative z-10">
                <div className="flex relative">
                    <div className="flex items-center gap-px p-1 rounded-xl bg-muted/60 backdrop-blur-sm border border-border shadow-sm">
                        <Button
                            size="sm"
                            variant={showPreview ? 'secondary' : 'ghost'}
                            className={`rounded-lg transition-all duration-200 ${
                                showPreview
                                    ? 'bg-secondary text-white shadow-sm'
                                    : 'hover:bg-muted/50 text-muted-foreground'
                            }`}
                            onClick={() => {
                                setShowPreview(true)
                                onSelectedTabChange?.('fragment')
                            }}
                        >
                            <Eye className="text-white/80" size={18} />
                        </Button>

                        {/* Separator */}
                        <div className="w-px h-6 bg-border/50 mx-1" />

                        <Button
                            size="sm"
                            variant={!showPreview ? 'secondary' : 'ghost'}
                            className={`rounded-lg transition-all duration-200 ${
                                !showPreview
                                    ? 'bg-secondary text-white shadow-sm'
                                    : 'hover:bg-muted/50 text-muted-foreground'
                            }`}
                            onClick={() => {
                                setShowPreview(false)
                                onSelectedTabChange?.('ide')
                            }}
                        >
                            <Code className="text-white/80" size={18} />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full h-full">
                <div
                    className={`h-full w-full ${showPreview ? 'block' : 'hidden'}`}
                >
                    {result || localStorageRes ? (
                        <FragmentPreview
                            result={
                                (result || localStorageRes) as ExecutionResult
                            }
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            Preview will appear here once the code is executed
                        </div>
                    )}
                </div>

                <div
                    className={`h-full w-full ${showPreview ? 'hidden' : 'block'}`}
                >
                    <IDE />
                </div>
            </div>
        </div>
    )
}
