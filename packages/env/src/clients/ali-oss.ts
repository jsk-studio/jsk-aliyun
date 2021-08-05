import OSS from 'ali-oss'
import { xSingleton } from '@jsk-std/x'
import { aliyunConfigs } from "../config";
import { authConfigs } from '@jsk-server/env';

export type IOSSOptions = {
    accessKeyId: string,
    accessKeySecret: string,
    region: string,
    internal?: boolean,
    bucket: string,
    endpoint: string,
}
export const ossClients = xSingleton(key => {
    const { aliyun: auth } = authConfigs
    const { oss: mItem } = aliyunConfigs
    const item = mItem?.[key]
    if (!item || !auth) {
        throw new Error("Create ali-oss clients is failure!");
    }
    return createOSSClient({
        accessKeyId: auth.accessKeyId,
        accessKeySecret: auth.accessKeySecret,
        region: mItem?.region || item.region,
        internal: !aliyunConfigs.dev,
        bucket: mItem?.bucket || item.bucket,
        endpoint: item.endpoint,
    })
})

export function createOSSClient(opts: IOSSOptions) {
    const internal = opts.internal ? '-internal' : '';
    const protocol = opts.internal ? 'https' : 'https';
    const endpoint = `${protocol}://${opts.bucket}.${opts.region}${internal}.aliyuncs.com`
    return new OSS({
        accessKeyId: opts.accessKeyId,
        accessKeySecret: opts.accessKeySecret!,
        region: opts.region,
        bucket: opts.bucket,
        endpoint,
        secure: true, 
        cname: true,
    })
}
