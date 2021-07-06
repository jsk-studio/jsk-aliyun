#!/usr/bin/env node
const { args } = require('@jsk-server/cli')
const { uploadFiles } = require('@jsk-aliyun/service')
const fs = require('fs')
const path = require('path')
const [filepath] = args
if (!filepath || !fs.existsSync(path.resolve(filepath))) {
    throw new Error('File is Not Exists: ' + filepath)
}
uploadFiles(path.resolve(filepath))