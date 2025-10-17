import { TokenType } from '../app/core/models/auth-state';

export const environment = {
    production: true,
    appName: '😊Shop',
    tokenType: 'SESSION' as TokenType,
    endpoint: 'http://localhost:8080/admin',
    uploadUrl: 'http://localhost:8080/admin/upload/file',
    mediaUrl: 'http://localhost:8080/admin/files',
};
