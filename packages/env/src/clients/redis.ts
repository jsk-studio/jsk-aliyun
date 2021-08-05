
import Redis from 'ioredis';
import { xSingleton } from '@jsk-std/x'
import { aliyunConfigs } from "../config";
import { authConfigs } from '@jsk-server/env';

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
  const { redis: mAuth } = authConfigs
  const { redis: mItem } = aliyunConfigs
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
