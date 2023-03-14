import { CallbackService } from 'vk-io';
import { DirectAuthorization, officialAppCredentials } from '@vk-io/authorization';

const callbackService = new CallbackService();

const directAuth = new DirectAuthorization({
    callbackService,

    scope: 'all',

    // Direct authorization is only available for official applications
    ...officialAppCredentials.android, // { clientId: string; clientSecret: string; }

    // Or manually provide app credentials
    // clientId: process.env.CLIENT_ID,
    // clientSecret: process.env.CLIENT_SECRET,

    login: process.env.VK_LOGIN,
    password: process.env.VK_PASSWORD,

    apiVersion: '5.131'
});

export default directAuth;