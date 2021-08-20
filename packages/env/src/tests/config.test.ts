
import path from 'path'
process.env.JSK_CONFIG_PATHS = `${path.join(__dirname, '../../test-configs')}`

import { redisClients } from "../clients/redis"
import { mysqlClients } from "../clients/mysql"
import { fcClients } from "../clients/ali-fc"
import { ossClients } from "../clients/ali-oss"
import { smsClients } from "../clients/ali-sms"
import { createOSSResClient, resClients } from "../clients/ali-oss-res"
import { aliyunConfigs } from '../config'
import { createProxyMatcher, fcRequestProxy } from '../clients/ali-fc-proxy'

test('test redis connection', async () => {
    const redis = redisClients['user']
    const val = Math.random().toString()
    await redis.set('redis-test', val)
    await redis.setex('json-key', 1000, JSON.stringify({ a : 1 }))
    const res = await redis.get('redis-test')
    const json = await redis.getJSON('json-key')
    const jsonNull = await redis.getJSON('json-key-null')
    expect(val).toEqual(res)
    expect(jsonNull).toEqual(null)
    expect(json.a).toEqual(1)
    redis.quit()
})

test('test mysql connection', async () => {
    const mysql = mysqlClients['search']
    const conn = await mysql.getConnection()
    const [row] = await conn.query<any>('SELECT * FROM `kanji` LIMIT 1')
    // console.log(row)
    expect(row.length).toEqual(1)
    conn.destroy()
})

test('test ali-fc connection', async () => {
    const fc = fcClients['search']
    const res = await fc.get('/search/kanji?keyword=[3]')
    expect(res.data.code).toEqual(0)
})

test('test ali-oss connection', async () => {
    const oss = ossClients['static']
    const res = await oss.get('/master-web/index.html')
    expect(String(res.content).length > 0).toEqual(true)
})

test('test ali-oss-res put', async done => {
    const res = createOSSResClient(aliyunConfigs.res)
    const web = resClients['web']
    await res.putFiles(process.env.JSK_CONFIG_PATHS + '/aliyun.toml')
    await res.putFiles(process.env.JSK_CONFIG_PATHS as string)
    await web.putFiles(process.env.JSK_CONFIG_PATHS as string)
    const resp = await res.putString('aaaaaa', '/test-string.json')
    expect(resp.public_url).toEqual('https://public.smoex.com/test-1234/test-string.json')
    done()
})

test('test ali-sms', async done => {
    const sms = smsClients['verify']
    // const res = await sms.send('18317893372', { code: 123456 })
    done()
})

test('test ali-fc-proxy', async done => {
    const matcher = createProxyMatcher({
        url: '/search/kanji?keyword=[3]',
        method: 'GET',
        headers: {}
    })
    const httpMatcher = createProxyMatcher({
        url: '/http-test/kanji?keyword=[3]',
        method: 'GET',
        headers: {}
    })
    const fcProxy = matcher('fc://')
    const httpProxy = httpMatcher('http://')
    const res = await fcRequestProxy(fcProxy)
    expect(res.data.code).toEqual(0)
    done()
})