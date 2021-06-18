
import Redis from 'ioredis';
import { xSingleton } from '@jsk-std/x'
import { aliyunConfigs } from "../config";

export type IRedisOptions = {
    host: string,
    password?: string,
    prefix?: string,
}

export function createRedisClient(opts: IRedisOptions) {
  const client = new Redis({
    host: opts.host,
    password: opts.password || undefined,
    keyPrefix: opts.prefix,
  })
  return client
}

export const redisClients = xSingleton(key => {
  const { redis: mAuth } = aliyunConfigs.auth
  const { redis: mItem } = aliyunConfigs.aliyun
  const auth = mAuth?.[key]
  const item = mItem?.[key]
  if (!item || !auth) {
      throw new Error("Create redis clients is failure!");
  }
  return createRedisClient({
      host: mItem?.host || item.host,
      password: auth?.password,
      prefix: `[${key}]`,
  })
})
