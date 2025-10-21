import { TokenType } from '@core/auth/models';

export const environment = {
    production: true,
    appName: '😊Shop',
    tokenType: 'SESSION' as TokenType,
    baseUrl: 'http://localhost:8080/admin',
    uploadUrl: 'http://localhost:8080/admin/upload/file',
    mediaUrl: 'http://localhost:8080/admin/files',
};
