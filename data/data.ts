export const filesEx = [
    // Code files
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.rs',
    '.py',
    '.go',
    '.java',
    '.cpp',
    '.c',
    '.cs',
    '.swift',
    '.rb',
    '.php',

    // Config files
    '.config.ts',
    '.config.js',
    '.config.mjs',
    '.config.cjs',
    '.json',
    '.yaml',
    '.yml',
    '.toml',
    '.ini',

    // Markdown & docs
    '.md',
    '.MD',
    '.mdx',
    '.txt',
    '.log',
    '.csv',

    // Style files
    '.css',
    '.scss',
    '.sass',
    '.less',
    '.styl',

    // Environment & ignore files
    '.env',
    '.env.local',
    '.env.development',
    '.env.production',
    '.gitignore',
    '.gitattributes',

    // Build / meta files
    '.lock',
    '.lockb',
    '.babelrc',
    '.eslintrc',
    '.prettierrc',
    '.editorconfig',

    // Binary / media files
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.webp',
    '.avif',
    '.mp3',
    '.mp4',
    '.mov',
    '.wav',
    '.webm',
    '.pdf',
    '.zip',
    '.tar',
    '.gz',

    // Misc
    '.dockerfile',
    '.dockerignore',
    '.sh',
    '.bat',
    '.ps1',
]

export const excludedPaths = [
    'node_modules',
    '.next',
    '.npm',
    '.config',
    'public',
]

export const excludedNames = [
    '.bash_logout',
    '.bashrc',
    '.profile',
    'README.md',
    'package-lock.json',
    '.update-notifier-last-checked',
]

export const languages: Record<string, string> = {
    '.tsx': 'typescript',
    '.ts': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascriptreact',
    '.css': 'css',
    '.json': 'json',
}
