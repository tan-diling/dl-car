import { config_get } from './config';

export const Mail_Server_Host = config_get("mail.host","smtp.gmail.com") ;
export const Mail_Server_User = config_get("mail.user","rscbg@testmvp.com") ;
export const Mail_Server_Password = config_get("mail.password","$7G!WFYkz2tlm") ;