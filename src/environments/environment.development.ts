import { TokenType } from '@auth';

// const SERVER_HOSTNAME = 'https://u1f606.com';
const SERVER_HOSTNAME = 'http://localhost:8080';

export const environment = {
    production: false,
    appName: '😊Shop',
    tokenType: 'SESSION' as TokenType,
    baseUrl: `${SERVER_HOSTNAME}/seller`,
    uploadUrl: `${SERVER_HOSTNAME}/files`,
    mediaUrl: `${SERVER_HOSTNAME}/files`,
};
