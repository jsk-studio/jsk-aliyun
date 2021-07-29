
// @ts-ignore
import FC from '@alicloud/fc2'
import { xSingleton } from '@jsk-std/x'
import { aliyunConfigs } from "../config";

export type IFCOptions = {
    accessKeyID: string,
    accessKeySecret: string,
    accountId: number,
    region: string,
    internal?: boolean,
    alias: string,
}

export const fcClients = xSingleton(key => {
    const { aliyun: auth } = aliyunConfigs.auth
    const { fc: mItem } = aliyunConfigs.env
    const item = mItem?.[key]
    if (!item || !auth) {
        throw new Error("Create ali-fc clients is failure!");
    }
    return createFCClient({
        accountId: auth.accountId,
        accessKeyID: auth.accessKeyId,
        accessKeySecret: auth.accessKeySecret,
        region: mItem?.region || item.region,
        alias: item.alias,
        internal: !aliyunConfigs.env.dev
    })
})


type IFCRequestOptions = {
    headers?: any,
    body?: any,
    params?: any,
    opts?: any,
}

type IFCClient = {
    get: <T = any>(path: string, params?: any, opts?: IFCRequestOptions) => Promise<T>
    post: <T = any>(path: string, body: any, opts?: IFCRequestOptions) => Promise<T>
    put: <T = any>(path: string, body: any, opts?: IFCRequestOptions) => Promise<T>
    delete: <T = any>(path: string, params?: any, opts?: IFCRequestOptions) => Promise<T>
    request: <T = any>(method: string, path: string, opts?: IFCRequestOptions) => Promise<T>
}

export function createFCClient(opts: IFCOptions) {
    const client = new FC(opts.accountId, {
        accessKeyID: opts.accessKeyID,
        accessKeySecret: opts.accessKeySecret,
        region: opts.region,
        internal: opts.internal,
    })

    const methods = ['get', 'post', 'put', 'delete']
    const { serviceName, functionName } = revertAliasrName(opts.alias)
    const proxy = { } as any
    const pathPrefix = `/proxy/${serviceName}/${functionName}`

    for (const key of methods) {
        proxy[key] = async (mpath: string, data: any, opts = {} as IFCRequestOptions) => {
            const { headers, params } = opts
            return await client[key](`${pathPrefix}${mpath}`, data, headers, params)
        }
    }
    proxy['request'] = async (method: string, mpath: string, ...args: any[]) => {
        return await client.request(method, `${pathPrefix}${mpath}`, ...args)
    }
    return proxy as IFCClient
}

function revertAliasrName(serverName: string) {
    const [name, code, version] = serverName.split('\.')
    const serviceName = `${name}-${name}-${code}.${version || name}`
    return { serviceName, functionName: name }
}

export function revertRequestUrl(url: string) {
    const fcVersion = '2016-08-15'
    const { fc } = aliyunConfigs.env
    const { functionName } = revertAliasrName(fc?.alias!)
    return url.replace(new RegExp(`/${fcVersion}/proxy(\/.*?\/)${functionName}`), '')
}
