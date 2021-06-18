import { getFilesRecursive } from '@jsk-std/io'
import { aliyunConfigs } from '../config'
import { ossClients } from '../clients/ali-oss'

export async function uploadFiles(fpath: string) {
    const files = getFilesRecursive(fpath)
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
        console.log(file, mname);
      await uploadFile(file, mname)
    }
}

export async function uploadFile(fpath: string, rpath: string) {
    const { oss } = aliyunConfigs.aliyun
    if(!oss?.client || !oss.client.includes('oss://') ) {
      throw new Error('Config Error: ' + oss);
    }
    const clientName = oss.client.trim().split('oss://')[1]
    const client = ossClients[clientName]
    if(!client) {
      throw new Error('Client Notfound: ' + oss.client);
    }
    const target = `/${oss.package}/${rpath}`
    try {
      const res = await client.put(target, fpath)
      console.log(`Upload Success: ${fpath} --> ${res.name}`)
    } catch (e) {
      console.error(e)
    }
}
