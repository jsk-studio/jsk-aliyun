// import { getFilesRecursive } from '@jsk-std/io'
// import { aliyunConfigs } from '../config'
// import { ossClients } from '../clients/ali-oss'

// export async function uploadFiles(fpath: string) {
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
//       await uploadFile(file, mname)
//     }
// }

// export async function uploadFile(fpath: string, rpath: string) {
//     const { res } = aliyunConfigs.aliyun
//     if(!res?.client || !res.client.includes('oss://') ) {
//       throw new Error('Config Error: ' + res);
//     }
//     const clientName = res.client.trim().split('oss://')[1]
//     const client = ossClients[clientName]
//     if(!client) {
//       throw new Error('Client Notfound: ' + res.client);
//     }
//     const target = `/${res.package}/${rpath}`
//     try {
//       const res = await client.put(target, fpath)
//       console.log(`Upload Success: ${fpath} --> ${res.name}`)
//     } catch (e) {
//       console.error(e)
//     }
// }
