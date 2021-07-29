import { aliyunConfigs } from '../config'
import { fcClients } from './ali-fc'
import { IncomingHttpHeaders } from 'http';

const proxyConfigs = createProxyConfigs()

export type IMatchOptions = {
    url: string,
    method: string,
    body?: any,
    headers?: IncomingHttpHeaders,
}

export type IFCProxyOptions = {
    opts: IMatchOptions,
    conf: {
        name: string,
        from: string,
        to: string,
    },
}

export function createProxyMatcher(opts: IMatchOptions) {
    const { clientProxy, httpProxy } = proxyConfigs
    return function(scheme: 'http://' | 'fc://') {
        if (scheme === 'http://') {
            return matchServiceConfig(httpProxy, opts.url)
        } else {
            const conf = matchServiceConfig(clientProxy, opts.url, scheme)
            if (!conf) {
                return null
            }
            return { conf, opts }
        }
    }
}

export async function fcRequestProxy(fcOpts: IFCProxyOptions) {
    const { conf, opts } = fcOpts
    const fc = fcClients[conf.name]
    if (!fc) {
        throw new Error('Can not Found the FC client: ' + conf.name)
    }
    return await fc.request(opts.method, opts.url.replace(conf.from, conf.to), { 
        headers: opts.headers,
        body: opts.body,
    })
}

function matchServiceConfig(proxies: any, url: string, prefix?: string) {
    for (const route of Object.keys(proxies)) {
        if (url.match(route)) {
            const proxy = proxies[route]
            if (!prefix) {
                return proxy
            }
            if (proxy.client.startsWith(prefix)) {
                const name = proxy.client.replace(prefix, '')
                return { ...proxy, name }
            }
        }
    }
    return null
}


function createProxyConfigs() {
    const httpProxy = {} as any
    const clientProxy = {} as any
    const proxies = aliyunConfigs.proxy
    for (const from of Object.keys(proxies)) {
        const conf = proxies[from]
        if (!conf) {
            continue
        }
        const { to, target, client } = conf  
        if (client) {
            clientProxy[`^${from}`] = { 
                from, 
                to: to || from, 
                client, 
            }
            continue
        }
        httpProxy[`^${from}`] = {
            target,
            changeOrigin: true,
            pathRewrite: {
                [`^${from}`]: to || from,
            }
        }
    } 
    return { httpProxy, clientProxy }
}



// export function createProxyMiddleware(opts: any) {
//     const { clientProxy, httpProxy } = proxyConfigs
//     return async (req: any, res: any, next: any) => {
//         try {
//             const httpConf = matchServiceConfig(httpProxy, opts.url)
//             const fcConf = matchServiceConfig(clientProxy, opts.url, 'fc://')
//             if (fcConf) {
//                 const fcRes = await fcServiceProxyMiddleware({
//                     method: req.method,
//                     url: req.url,
//                     headers: req.headers,
//                     conf: fcConf
//                 })
//                 req.end(fcRes)
//             } else if (httpConf) {
//                 const httpMiddleware = createHttpProxyMiddleware(httpConf)
//                 httpMiddleware(req, res, next);
//             }
//         } catch(e) {
//             next(e)
//         }
        
//     }
// }
