import { useEffect, useState } from 'react'

export function useLocalStorage(
    key: 'result' | 'files',
): [any, (val: string) => void] {
    const [value, setValue] = useState(localStorage.getItem(key))

    useEffect(() => {
        const lsValue = localStorage.getItem(key)
        if (lsValue) return setValue(lsValue)
    }, [key])

    function setterFn(value: string) {
        localStorage.setItem(key, value)
        setValue(value)
    }

    return [value, setterFn]
}
