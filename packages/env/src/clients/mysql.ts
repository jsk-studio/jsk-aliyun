import mysql from 'mysql2/promise'
import { xSingleton } from '@jsk-std/x'
import { aliyunConfigs } from "../config";
import { authConfigs } from '@jsk-server/env';

export type IMysqlOptions = {
    host: string,
    password: string,
    database: string,
    user: string,
}

export const mysqlClients = xSingleton(key => {
    const { mysql: mAuth } = authConfigs
    const { mysql: mItem } = aliyunConfigs
    const auth = mAuth?.[key]
    const item = mItem?.[key]
    if (!item || !auth) {
        throw new Error("Create mysql clients is failure! " + auth + item);
    }
    return createMysqlClient({
        user: auth.user,
        password: auth.password,
        database: item.database,
        host: item.host || mItem?.host || '',
    })
})


export function createMysqlClient(opts: IMysqlOptions) {
    return mysql.createPool({
        connectionLimit: 20, //连接池连接数
        host: opts.host, //数据库地址，这里用的是本地
        database: opts.database, //数据库名称
        user: opts.user,  // username
        password: opts.password, // password
        connectTimeout: 1000,
        multipleStatements: true,
    })
}