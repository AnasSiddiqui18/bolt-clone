import { Sandbox } from '@e2b/code-interpreter'
import { FileSystemNode } from '@/components/file-tree'

export const maxDuration = 60
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const excludedPaths = ['node_modules', '.next', '.npm', '.config', 'public']
const excludedNames = [
    '.bash_logout',
    '.bashrc',
    '.profile',
    'README.md',
    'globe.svg',
    'file.svg',
    'next.svg',
    'vercel.svg',
    'favicon.ico',
    'window.svg',
    '.update-notifier-last-checked',
]

/**
 * GET /api/sandbox/[sbxId]/files
 * Fetches the file tree from an E2B sandbox
 */
export async function GET(
    _req: Request,
    { params }: { params: { sbxId: string } }
) {
    try {
        const { sbxId } = params

        if (!sbxId) {
            return new Response(
                JSON.stringify({ error: 'Missing sandbox ID' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            )
        }

        if (!process.env.E2B_API_KEY) {
            return new Response(
                JSON.stringify({ error: 'E2B_API_KEY not configured' }),
                {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' },
                }
            )
        }

        // Connect to existing sandbox
        const sbx = await Sandbox.connect(sbxId)

        // Use E2B SDK's files.list() method for robust file listing
        const filesList = await sbx.files.list('/home/user', {
            depth: 3,
            user: 'root',
        })

        // Convert E2B file structure to our FileSystemNode format
        const files = convertE2BFilesToTree(filesList)

        return new Response(JSON.stringify({ files }), {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error: any) {
        console.error('Error fetching sandbox files:', error)
        return new Response(
            JSON.stringify({
                error: 'Failed to fetch sandbox files',
                details: error?.message || 'Unknown error',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

/**
 * Convert E2B file list to our FileSystemNode structure
 */
function convertE2BFilesToTree(e2bFiles: any[]): FileSystemNode[] {
    const files = e2bFiles
        .filter(
            (file) =>
                !excludedPaths.some((p) => file.path.includes(p)) &&
                !excludedNames.includes(file.name)
        )
        .map((file) => {
            const node: FileSystemNode = {
                name: file.name,
                isDirectory: file.isDir,
                path: file.path,
            }

            // Recursively convert children if it's a directory
            if (file.isDir && file.children) {
                node.children = convertE2BFilesToTree(file.children)
            }

            return node
        })

    return files
}
