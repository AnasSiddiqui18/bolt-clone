import { writeFileSync } from 'fs'

const base_path = '/home/user'

const path = `${base_path}/src/app/tailwind.config.ts`

// src -> app -> tailwind.config.ts

type fileStructure = { label: string; children: fileStructure[] }

const removeEmptyChar = (str: string) => str.split('/').filter((e) => e.trim())
const getNextChild = (arr: string[]) => arr.splice(1).join('/')

function addChildrenFiles(
    parentArr: fileStructure,
    further_path: string // /app/tailwind.config.ts
) {
    console.log('calls', further_path)

    const directChild = removeEmptyChar(further_path) // ['app', 'tailwind.config.ts']

    if (!directChild.length) {
        console.log('no length found... returning')
        return parentArr
    }

    const nextChild = getNextChild(directChild)
    const object = { label: directChild.at(0)!, children: [] }
    parentArr.children.push(object)
    addChildrenFiles(object, `${nextChild}`) // '/tailwind.config.ts'
    return parentArr
}

function generateFileTree() {
    const rootPath = path.split(base_path).at(1)! // '/src/app/tailwind.config.ts'
    const correctPath = removeEmptyChar(rootPath) // ['src', 'app', 'tailwind.config.ts' ]

    const childPath = getNextChild(correctPath)
    const object = { label: correctPath[0], children: [] }
    const response = addChildrenFiles(object, `/${childPath}`) // '/app/tailwind.config.ts'
    return response
}

// const files = generateFileTree()

// writeFileSync('structure.json', JSON.stringify(files))

// console.log(files)
