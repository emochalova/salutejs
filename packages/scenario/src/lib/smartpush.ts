import fetch from 'node-fetch';

import { DeliveryConfig, SmartPushRequest, SmartPushResponse } from './types/push';

// http://salute.online.sberbank.ru:9443/smartmarket/smartpush/apprequest
const URL = 'https://smartapptest.online.sberbank.ru:9444/api/v2/smartpush/apprequest';
// const TOKEN_URL = 'https://salute.online.sberbank.ru:9443/api/v2/oauth';
const TOKEN_URL = 'https://smartapptest.online.sberbank.ru:9444/api/v2/oauth';

const requestAccesToken = async ({
    clientId,
    secret,
    scope,
}): Promise<{ access_token: string; expires_at: number }> => {
    return fetch(TOKEN_URL, {
        headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Rquid: '34e8a16e-e4e3-4271-b4ed-4c954c892c7e',
        },
        method: 'POST',
        body: `scope=${scope}`,
    }).then((res) => res.json());
};

export const sendPush = async ({
    projectId,
    clientIdSub,
    deliveryConfig,
}: {
    projectId: string;
    clientIdSub: string;
    deliveryConfig: DeliveryConfig;
}): Promise<SmartPushResponse> => {
    const body: SmartPushRequest = {
        protocolVersion: 'V1',
        messageName: 'SEND_PUSH',
        messageId: 1,
        payload: {
            sender: {
                projectId,
            },
            recipient: {
                clientId: {
                    idType: 'SUB',
                    id: clientIdSub,
                },
            },
            deliveryConfig,
        },
    };

    const { access_token } = await requestAccesToken({ ...p, scope: ['SMART_PUSH'] });
    const answer = await fetch(URL, {
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
            Rquid: '34e8a16e-e4e3-4271-b4ed-4c954c892c7e',
        },
        method: 'post',
        body: JSON.stringify(body),
    });

    return answer.json();
};

sendPush({
    projectId: '3fa85f64-5717-4562-b3ab-2c963f66baa6', // id навыка из студии
    clientIdSub: '6852d76cea737bb751f89e82523a2d97f9765c0d7b8a6eaf821497c1b17df87ba3028e64eea639f7', // sub из запросов клиента
    deliveryConfig: {
        deliveryMode: 'broadcast',
        destinations: [
            {
                channel: 'B2C', // всегда B2C или COMPANION_B2C (с поверхностью COMPANION)
                surface: 'SBERBOX',
                templateContent: {
                    id: '', // id шаблона уведомления из студии
                    headerValues: { headertext: 'Заголовок' },
                    bodyValues: { bodytext: 'Тело сообщения' },
                },
            },
        ],
    },
}).then(console.log);

// {
//     "protocolVersion": "V1",
//     "messageId": 37284759,
//     "messageName": "SEND_PUSH",
//     "payload": {
//         "sender": {
//             "projectId": "3fa85f64-5717-4562-b3ab-2c963f66baa6",
//             "application": {
//                 "appId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
//                 "versionId": "fcac2f61-57a7-4d6d-b3fc-2c963f66a111"
//             }
//         },
//         "recipient": {
//             "clientId": {
//                 "idType": "SUB",
//                 "id": "6852d76cea737bb751f89e82523a2d97f9765c0d7b8a6eaf821497c1b17df87ba3028e64eea639f7"
//             }
//         },
//         "deliveryConfig": {
//             "deliveryMode": "BROADCAST",
//             "destinations": [{
//                     "channel": "COMPANION_B2C",
//                     "surface": "COMPANION",
//                     "templateContent": {
//                         "id": "49061553 - 27 c7 - 4471 - 9145 - d8d6137657da",
//                         "headerValues": {
//                             "clientname": "Иван",
//                             "bandname": "Ласковый май"
//                         },
//                         "bodyValues": {
//                             "formatname": "альбома",
//                             "bandname": "\"Ласковый май\"",
//                             "releasename": "\"Новое\""
//                         },
//                         "mobileAppParameters": {
//                             "deeplinkAndroid": "laskoviyi-mai-listen-android",
//                             "deeplinkIos": "laskoviyi-mai-listen-ios",
//                             "buttonText": "Слушать"
//                         },
//                         "timeFrame": {
//                             "startTime": "13:30:00",
//                             "finishTime": "15:00:00",
//                             "timeZone": "GMT+03:00",
//                             "startDate": "2020-06-04",
//                             "endDate": "2020-06-05"
//                         }
//                     }
//                 },
//                 {
//                     "channel": "B2C",
//                     "surface": "STARGATE",
//                     "templateContent": {
//                         "id": "49061553 - 27 c7 - 4471 - 9145 - d8d6137657da",
//                         "headerValues": {
//                             "clientname": "Иван",
//                             "bandname": "Ласковый май"
//                         },
//                         "bodyValues": {
//                             "formatname": "альбома",
//                             "bandname": "\"Ласковый май\"",
//                             "releasename": "\"Новое\""
//                         },
//                         "deviceParameters": {
//                             "backgroundImageUri": "laskoviyi-mai-listen-android",
//                             "deeplink": "laskoviyi-mai-listen-ios",
//                             "deviceSerialFilter": [{
//                                 "serialNumber": "AA9999999999999",
//                                 "product": "sberbox"
//                             }]
//                         }
//                     }
//                 }
//             ]
//         }
//     }
// }
