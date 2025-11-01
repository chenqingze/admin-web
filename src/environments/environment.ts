import { TokenType } from '@auth';

export const environment = {
    production: true,
    appName: '😊Shop',
    tokenType: 'SESSION' as TokenType,
    baseUrl: 'http://localhost:8080/seller',
    uploadUrl: 'http://localhost:8080/files',
    mediaUrl: 'http://localhost:8080/admin/files',
};
