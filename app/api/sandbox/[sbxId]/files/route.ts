import { Sandbox } from '@e2b/code-interpreter'
import { buildFolderTree } from '@/helpers/helpers'
import { writeFileSync } from 'fs'

export const maxDuration = 60
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

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

        const constantFiles = [
            {
                name: 'tsconfig.json',
                type: 'file',
                path: '/home/user/tsconfig.json',
                size: 602,
                mode: 420,
                permissions: '-rw-r--r--',
                owner: 'user',
                group: 'user',
                modifiedTime: '2025-10-19T00:39:56.257Z',
            },
        ]

        // Convert E2B file structure to our FileSystemNode format
        const files = buildFolderTree(filesList)

        writeFileSync('file-list.json', JSON.stringify(filesList))

        // console.log('writing files inside file-list.json')

        // writeFileSync('data.json', JSON.stringify(files))
        // console.log('files', files.length)

        return new Response(JSON.stringify({ files: files }), {
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
