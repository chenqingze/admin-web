import { TokenType } from '@core/auth/models/auth-state';

export const environment = {
    production: false,
    appName: '😊Shop',
    tokenType: 'SESSION' as TokenType,
    endpoint: 'http://localhost:8080/admin',
    uploadUrl: 'http://localhost:8080/admin/upload/file',
    mediaUrl: 'http://localhost:8080/admin/files',
};
