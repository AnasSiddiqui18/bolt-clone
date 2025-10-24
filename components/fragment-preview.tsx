'use client'

import { useEffect } from 'react'
import { FragmentInterpreter } from './fragment-interpreter'
import { FragmentWeb } from './fragment-web'
import { ExecutionResult } from '@/lib/types'

export function FragmentPreview({ result }: { result: ExecutionResult }) {
    useEffect(() => {
        console.log('result', result)
    }, [result])

    return <FragmentWeb result={result} />
}
