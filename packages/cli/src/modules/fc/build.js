#!/usr/bin/env node
const { args } = require('@jsk-server/cli')
const { deleteFolderRecursive, createFolders } = require('@jsk-std/io')
const path = require('path')
const compressing = require('compressing') 
const fs = require('fs')

const [rootDir] = args
process.env.JSK_ROOT_DIR = process.env.JSK_ROOT_DIR || rootDir || '.'
const { spawnSync } = require('child_process');

deleteFolderRecursive(path.join(rootDir, './dist'))

spawnSync('jsk-server build', [], { stdio: 'inherit', shell: true })

const bundleDir = `${rootDir}/dist/bundle`

createFolders([
    bundleDir + '/dist',
    bundleDir + '/conf',
])

copyFilesSync([
    './package.json',
    './dist/index.js',
    './conf/aliyun.toml',
    './conf/auth.toml',
    './conf/proxy.toml',
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