import { getFilesRecursive } from '@jsk-std/io'
import { aliyunConfigs } from '../config'
import { ossClients } from '../clients/ali-oss'
import { PassThrough} from 'stream'
import { xSingleton } from '@jsk-std/x'
import path from 'path'


export type IOSSResOption = {
    client?: string,
    package?: string,
}

export const resClients = xSingleton(key => {
    const { aliyun: auth } = aliyunConfigs.auth
    const { res: mItem } = aliyunConfigs.env
    const item = mItem?.[key]
    if (!item || !auth) {
        throw new Error("Create ali-oss-res clients is failure!");
    }
    return createOSSResClient(item)
})

export function createOSSResClient(opts?: IOSSResOption) {
    if (opts && !opts.client) {
        opts.client = aliyunConfigs.env.res?.client
    }
    if (!opts?.client || !opts.client.includes('oss://') ) {
        throw new Error('Config Error: ' + opts);
    }
    const clientName = opts.client.trim().split('oss://')[1]
    const client = ossClients[clientName]
    const clientConf = aliyunConfigs.env.oss?.[clientName]
    if (!client || !clientConf) {
        throw new Error('Client Notfound: ' + opts.client);
    }
    if (!opts.package) {
        throw new Error('Notfound package Error: ' + opts);
    }
    const pkg = opts.package
    const remotePath = clientConf.endpoint
    async function putFile(fpath: string, rpath: string) {
        const target = path.join(pkg, rpath)
        const res = await client.put(target, fpath)
        console.log(`Upload Success: ${fpath} --> ${res.name}`)
        return { ...res, public_url: `${remotePath}/${res.name}` }
    } 
    
    async function putString(buf: Buffer | string, rpath: string) {
        const stream = new PassThrough()
        if (typeof buf === 'string') {
            stream.end(Buffer.from(buf, 'utf-8'))
        } else {
            stream.end(buf)
        }
        const target = path.join(pkg, rpath)
        const res = await client.putStream(target, stream)
        console.log(`Upload Success: buffer --> ${res.name}`)
        return { ...res, public_url: `${remotePath}/${res.name}` }
    }

    async function putFiles(fpath: string) {
        const files = getFilesRecursive(fpath)
        let count = 0
        // 上传目录时忽略根目录
        for (const file of files) {
          const fname = file === fpath 
            ? file
                .replace('\\', '/')
                .replace(/.*?\//g, '')
            : file.replace(fpath, '')
    
          const mname = fname
            .replace('\\', '/')
            .replace(/^\.\//i, '')
            .replace(/.*?\//i, '')
          await putFile(file, mname)
          count ++
        }
        if (count < files.length) {
            throw new Error('Put File Failure !!!')
        }
    }

    async function putObject(obj: any, rpath: string) {
        return await putString(JSON.stringify(obj), rpath)
    }
    return {
        putFiles,
        putFile,
        putString,
        putObject,
    }
}

// async function putFiles(fpath: string) {
//     const files = getFilesRecursive(fpath)
//     // 上传目录时忽略根目录
//     for (const file of files) {
//       const fname = file === fpath 
//         ? file
//             .replace('\\', '/')
//             .replace(/.*?\//g, '')
//         : file.replace(fpath, '')

//       const mname = fname
//         .replace('\\', '/')
//         .replace(/^\.\//i, '')
//         .replace(/.*?\//i, '')
//         console.log(file, mname);
//       await putFile(file, mname)
//     }
// }

// async function putFile(fpath: string, rpath: string) {
//     const { res } = aliyunConfigs.aliyun
//     if (!res?.package) {
//         throw new Error('Notfound package Error: ' + res);
//     }
//     const client = getClient()
//     const target = path.join(res.package, rpath)
//     try {
//       const res = await client.put(target, fpath)
//       console.log(`Upload Success: ${fpath} --> ${res.name}`)
//     } catch (e) {
//       console.error(e)
//     }
// }

// async function putObject(obj: any, rpath: string) {
//     await putString(obj, rpath)
// }

// async function putString(buf: Buffer | string, rpath: string) {
//     const { res } = aliyunConfigs.aliyun
//     if (!res?.package) {
//         throw new Error('Notfound package Error: ' + res);
//     }
//     const client = getClient()

//     const stream = new PassThrough()
//     if (typeof buf === 'string') {
//         stream.end(Buffer.from(buf, 'utf-8'))
//     } else {
//         stream.end(buf)
//     }
//     const target = path.join(res.package, rpath)
//     try {
//         await client.putStream(target, stream)
//         console.log(`Upload Success: buffer --> ${res.name}`)
//     } catch (e) {
//         console.error(e)
//     }
// }

// function getClient() {
//     const { res } = aliyunConfigs.aliyun
//     if(!res?.client || !res.client.includes('oss://') ) {
//       throw new Error('Config Error: ' + res);
//     }
//     const clientName = res.client.trim().split('oss://')[1]
//     const client = ossClients[clientName]
//     if(!client) {
//       throw new Error('Client Notfound: ' + res.client);
//     }
//     return client
// }