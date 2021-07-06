#!/usr/bin/env node
const { args } = require('@jsk-server/cli')
const { deleteFolderRecursive, createFolders } = require('@jsk-std/io')
const path = require('path')
const compressing = require('compressing') 
const fs = require('fs')

const [rootDir] = args
process.env.JSK_ROOT_DIR = process.env.JSK_ROOT_DIR || rootDir
const { spawnSync } = require('child_process');

deleteFolderRecursive(path.join(rootDir, './build'))

spawnSync('jsk-server build', [], { stdio: 'inherit', shell: true })

const bundleDir = `${rootDir}/build/bundle`

createFolders([
    bundleDir + '/build',
    bundleDir + '/config',
])

copyFilesSync([
    './package.json',
    './build/index.js',
    './config/aliyun.toml',
    './config/auth.toml',
    './config/proxy.toml',
])

compressing.zip.compressDir(bundleDir, bundleDir + '.zip').then(() => {
    deleteFolderRecursive(bundleDir)
})


function copyFilesSync(files) {
    for (const file of files) {
        const url = path.join(rootDir, file)
        console.log(url);
        if (!fs.existsSync(url)) {
            continue
        }
        fs.copyFileSync(path.resolve(url), path.join(bundleDir, file))
    }
}