const fs = require('fs')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

// if (!name) {
//     throw new Error('dir name is nessary!')
// }
// const root = `src/page/${name}`
// const config = JSON.parse(fs.readFileSync(`${root}/package.json`, { encoding: 'utf-8' }))

module.exports = {
    argv,
    // rootDir: root,
    // pkgConfig: config,
    // pathName: name,
    args: argv._,
}