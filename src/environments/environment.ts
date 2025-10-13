import { AccessTokenType } from '../app/core/auth/models/auth-state';

export const environment = {
    production: true,
    appName: '😊Shop',
    accessTokenType: 'SESSION' as AccessTokenType,
    endpoint: 'http://localhost:8080/admin',
    uploadUrl: 'http://localhost:8080/admin/upload/file',
    mediaUrl: 'http://localhost:8080/admin/files',
};
