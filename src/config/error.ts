import { config_get } from './config';

export const AppError = {        
    "account_invalid":"email or password not valid", 
    "account_forbidden":"this account is not allowed to login.",
    "password_check_error":"email or password check invalid",
    "refresh_invalid": "refresh token is invalid",
    "refresh_expired": "refresh token expired",
    "file_invalid":"Invalid file format",
    "jwt_expires":"jwt token expires",
    "jwt_invalid":"jwt token invalid"
}

export function errorMessage(errorCode:string){
    return config_get(`error.${errorCode}`,errorCode.replace('_',' ')) ;
}

