#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path')
const { args } = require('@jsk-server/cli')
const [cmd = '', ...options] = args

const [service,command] = cmd.split('-')

if (!service || !command) {
    throw new Error(`Not Support this command: ${cmd}`)
}

const commandPath = path.join(__dirname, 'modules', service, `${command}.js`)

if (!fs.existsSync(commandPath)) {
    throw new Error(`Not Support this command: ${service}-${command}`)
}

spawnSync(`node ${commandPath}`, options, { stdio: 'inherit', shell: true })

