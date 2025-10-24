import Editor, { Monaco } from '@monaco-editor/react'
import { useEffect, useRef } from 'react'
import * as monacoEditor from 'monaco-editor'
import { useTheme } from 'next-themes'
import prettier from 'prettier/standalone'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import * as prettierPluginTypeScript from 'prettier/plugins/typescript'

// @ts-ignore
import './code-theme.css'

export function CodeEditor({
    code,
    lang,
    onChange,
}: {
    code: string
    lang: string
    onChange: (value: string | undefined) => void
}) {
    useEffect(() => {
        console.log('language', lang)
    }, [lang])

    const { theme } = useTheme()
    const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(
        null,
    )

    function handleEditorDidMount(
        editor: monacoEditor.editor.IStandaloneCodeEditor,
        monaco: Monaco,
    ) {
        editorRef.current = editor

        // Quick save shortcut (Ctrl/Cmd + S)
        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
            async () => {
                // Trigger save event - the parent component should handle this
                const currentCode = editor.getValue()
                onChange(currentCode)

                try {
                    const formatted = await prettier.format(code, {
                        parser: 'typescript',
                        plugins: [prettierPluginTypeScript],
                        semi: true,
                        singleQuote: false,
                        trailingComma: 'all',
                        tabWidth: 4,
                    })

                    editor.setValue(formatted)
                } catch (err) {
                    console.error('Prettier formatting failed:', err)
                }
            },
        )

        // Find and replace (Ctrl/Cmd + H) - Monaco has this built-in but let's ensure it's enabled
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
            editor.trigger('', 'editor.action.startFindReplaceAction', {})
        })

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
            lib: ['es2020', 'dom'],
        })

        // Format document (Alt + Shift + F)
        editor.addCommand(
            monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
            () => {
                editor.trigger('', 'editor.action.formatDocument', {})
            },
        )
    }

    return (
        <Editor
            language={lang}
            value={code}
            onChange={onChange}
            theme={theme === 'dark' ? 'vs-dark' : 'vs'}
            onMount={handleEditorDidMount}
            options={{
                minimap: {
                    enabled: false,
                },
                fontSize: 14,
                fontFamily:
                    'JetBrains Mono, SF Mono, Monaco, Inconsolata, Fira Code, Droid Sans Mono, Consolas, monospace',
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                detectIndentation: true,
                renderWhitespace: 'selection',
                bracketPairColorization: {
                    enabled: true,
                },
                guides: {
                    bracketPairs: true,
                    indentation: true,
                },
                suggest: {
                    showKeywords: true,
                    showSnippets: true,
                },
                quickSuggestions: {
                    other: true,
                    comments: true,
                    strings: true,
                },
                folding: true,
                foldingStrategy: 'indentation',
                showFoldingControls: 'mouseover',
                lineNumbers: 'on',
                glyphMargin: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                // Enable find widget
                find: {
                    addExtraSpaceOnTop: false,
                    autoFindInSelection: 'never',
                    seedSearchStringFromSelection: 'always',
                },
            }}
        />
    )
}
