import { config_get } from './config';

const Mail_Server_Host: string = config_get("mail.host", "smtp.gmail.com");
const Mail_Server_Port: string = config_get("mail.port", "465");
const Mail_Server_User: string = config_get("mail.user", "dilingcloud@gmail.com");
const Mail_Server_Password: string = config_get("mail.password", "");


export interface MailConfig {
    host: string;
    port: number;
    user: string;
    password: string;
}

export let mailConfig: MailConfig = {
    host: Mail_Server_Host,
    port: Number(Mail_Server_Port),
    // secure: true, // true for 465, false for other ports
    user: Mail_Server_User,
    password: Mail_Server_Password,
};
