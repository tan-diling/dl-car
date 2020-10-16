import { config_get } from './config';

export const Mail_Server_Host = config_get("mail.host","smtp.gmail.com") ;
export const Mail_Server_User = config_get("mail.user","dl@testmvp.com") ;
export const Mail_Server_Password = config_get("mail.password","Zt:[1nY{/LDh4r") ;