import { SettingModel } from '@app/models/setting';

type SettingKeys = "AllowPublicRegistration" | "Mail";
/**
 * setting service
 */
export class SettingService {

    async get(k: SettingKeys) {
        const setting = await SettingModel.findOne({ key: k }).exec();
        if (setting) {
            return setting.val;
        }
    }

    /**
     * create an new user
     * @param dto 
     */
    async set(k: SettingKeys, val) {
        const setting = await SettingModel.findOneAndUpdate({ key: k }, { key: k, val: val }, { upsert: true, new: true }).exec();
        return setting.val;
    }


}