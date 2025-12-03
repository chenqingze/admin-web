import { TokenType } from '@auth';

const SERVER_HOSTNAME = 'http://u1f606.com';

export const environment = {
    production: true,
    appName: '😊Shop',
    tokenType: 'SESSION' as TokenType,
    baseUrl: `${SERVER_HOSTNAME}/seller`,
    uploadUrl: `${SERVER_HOSTNAME}/files`,
    mediaUrl: `${SERVER_HOSTNAME}/files`,
};
