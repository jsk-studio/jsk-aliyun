#!/usr/bin/env node
const { args } = require('@jsk-server/cli')
const { createOSSResClient, aliyunConfigs } = require('@jsk-aliyun/env')
const oss = createOSSResClient(aliyunConfigs.env.res)
const fs = require('fs')
const path = require('path')
const [filepath] = args
if (!filepath || !fs.existsSync(path.resolve(filepath))) {
    throw new Error('File is Not Exists: ' + filepath)
}
oss.putFiles(path.resolve(filepath))