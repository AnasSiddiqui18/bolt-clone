'use client'

import { TreeView } from '@/components/tree-view-component'

export default function Page() {
    const treeData = [
        {
            id: '1',
            label: 'src',
            children: [
                {
                    id: '1-1',
                    label: 'app',
                    children: [
                        { id: '1-1-1', label: 'layout.tsx' },
                        { id: '1-1-2', label: 'app.tsx' },
                        { id: '1-1-2', label: 'globals.css' },
                    ],
                },
            ],
        },
        {
            id: '2',
            label: 'tailwind.config.ts',
        },

        {
            id: '3',
            label: 'package.json',
        },
    ]

    return (
        <div className="bg-none min-h-screen">
            <TreeView
                data={treeData}
                onNodeClick={(node) => console.log('Clicked:', node.label)}
                defaultExpandedIds={['1']}
            />
        </div>
    )
}
