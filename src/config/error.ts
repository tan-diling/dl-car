import { config_get } from './config';

const errors = {        
    "account_exists":"That Email is taken, try another.", 
    "account_invalid":"Couldn't find your DL Account", 
    "password_invalid":"Invalid password", 
    "account_forbidden":"This account hasn’t been activated, please find the DL sign-up confirmation link in your mailbox.",
    "password_check_error":"Email or password check invalid",
    "refresh_invalid": "Refresh token is invalid",
    "refresh_expired": "Refresh token expired",
    "file_invalid":"Invalid file format",
    "jwt_expires":"Jwt token expires",
    "jwt_invalid":"Jwt token invalid"
}

export function errorMessage(errorCode:string){
    // return config_get(`error.${errorCode}`,errorCode.replace('_',' ')) ;

    return errors[errorCode] || config_get(`error.${errorCode}`,errorCode.replace('_',' ')) ;
}

