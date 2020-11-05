
/**
 * user service
 */
export class SettingService {
    static
        readonly USER_MAIL_NOTIFICATION = 'mail.notification';
    static
        readonly SITE_ALLOW_PUBLIC_REGISTER = 'site.allow_public_register';
    static
        readonly SITE_MAIL_CONFIG = 'site.mail_config';


    async get(k: string) {

    }

    /**
     * create an new user
     * @param dto 
     */
    async set(k: string, value) {

    }


}