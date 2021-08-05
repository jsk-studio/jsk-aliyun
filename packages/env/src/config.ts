import { readTomlConfig } from "@jsk-server/env"

export const aliyunConfigs = readTomlConfig<IAliyunConfigs>('aliyun')

type IAliyunConfigs = {
    dev?: boolean,
    oss?: MapKeyTypes<IAliyunOSSItem>,
    res?: MapKeyTypes<IAliyunOSSResItem>,
    fc?: MapKeyTypes<IAliyunFCItem>,
    sms?: MapKeyTypes<IAliyunSMSItem>,
    mysql?:  MapKeyTypes<IMysqlItem>,
    redis?: MapKeyTypes<IRedisItem>,
}

type IMysqlItem = {
    database: string,
    host?: string
}

type IAliyunOSSItem = {
    region: string,
    bucket: string,
    endpoint: string,
}
type IAliyunOSSResItem = {
    client?: string,
    package?: string,
}
type IAliyunFCItem = {
    region: string,
    alias: string,
}
type IAliyunSMSItem = {
    sign: string,
    template: string,
}

type IRedisItem = {
    host: string,
}

type MapKeyTypes<T> = { [key in string] : T } & T
