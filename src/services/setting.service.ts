import { SettingModel } from '@app/models/setting';
import { mailConfig, MailConfig } from '@app/config';

type SettingKeys = "AllowPublicRegistration" | "Mail";


function setMailConfig(val: MailConfig) {
    mailConfig.host = val.host;
    mailConfig.port = val.port;
    mailConfig.user = val.user;
    mailConfig.password = val.password;
}

/**
 * setting service
 */
export class SettingService {

    private async get(k: SettingKeys) {
        const setting = await SettingModel.findOne({ key: k }).exec();
        if (setting) {
            return setting.val;
        }
    }

    /**
     * create an new user
     * @param dto 
     */
    private async set(k: SettingKeys, val) {
        const setting = await SettingModel.findOneAndUpdate({ key: k }, { key: k, val: val }, { upsert: true, new: true }).exec();
        return setting.val;
    }

    async allowPublicRegistration(enabled?: boolean) {
        if (enabled != null) {
            this.set('AllowPublicRegistration', enabled);
        }

        return (await this.get('AllowPublicRegistration')) == true;
    }

    async mail(val?: MailConfig) {
        if (val != null) {
            this.set('Mail', val);

            setMailConfig(val);

        }

        const ret = await this.get('Mail') as MailConfig;

        return { ...mailConfig, ...ret, };
    }
}

export const SettingServiceStartup = async () => {
    const service = new SettingService();
    setMailConfig(await service.mail());
}
