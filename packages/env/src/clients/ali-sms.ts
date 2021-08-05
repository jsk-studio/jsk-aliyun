import Sms from '@alicloud/pop-core'
import { authConfigs } from '@jsk-server/env';
import { xSingleton } from '@jsk-std/x'
import { aliyunConfigs } from "../config";

export type ISmsOptions = {
    accessKeyId: string,
    accessKeySecret: string,
    signName: string,
    templateCode: string,
}

export const smsClients = xSingleton(key => {
    const { aliyun: auth } = authConfigs
    const { sms: mItem } = aliyunConfigs
    const item = mItem?.[key]
    if (!item || !auth) {
        throw new Error("Create ali-sms clients is failure!");
    }
    return createSmsClient({
        accessKeyId: auth.accessKeyId,
        accessKeySecret: auth.accessKeySecret,
        signName: item.sign,
        templateCode: item.template,
    })
})

export function createSmsClient(opts: ISmsOptions) {
    const client = new Sms({
        accessKeyId: opts.accessKeyId,
        accessKeySecret: opts.accessKeySecret,
        endpoint: 'https://dysmsapi.aliyuncs.com',
        apiVersion: '2017-05-25'
    })
    return {
        async send(phone: string, param?: any) {
            return await client.request('SendSms', {
                'PhoneNumbers': phone,
                'SignName': opts.signName,
                'TemplateCode': opts.templateCode,
                'TemplateParam': JSON.stringify(param),
            }, { method: 'POST' })
        }
    }
}