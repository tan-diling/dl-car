import { prop, Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index } from '@typegoose/typegoose';

import * as moment from 'moment';
import * as randToken from 'rand-token';

const OTP_EXPIRES = 20;

/** one time pin code  */
export class OneTimePin {
    @prop({ unique: true })
    key: string;

    @prop({})
    pin?: string;

    @prop({ default: Date.now })
    createTime?: Date;


    /** one time pin code validation */
    static async validateCode(key: string, code: string) {
        const otp = await OneTimePinModel.findOne({ key }).exec();

        if (otp != null && otp.pin == code) {
            await otp.remove();
            if (moment().add(-OTP_EXPIRES, 'minutes').valueOf() < otp.createTime.valueOf()) {
                return true;
            }
            return false;
        }

        return false;

    }

    /** one time pin code generate */
    static async generateCode(key: string) {
        const pin = randToken.generate(6, "0123456789");
        await OneTimePinModel.remove({ key }).exec();
        const otp = await OneTimePinModel.create({ key, pin });

        return otp.pin;
    }
}

/** 
 * one time pin model
 * `
 *   //generate code with phone number
 *   const phone = '13xxxxxxxxxx';
 *   const code = OneTimePinModel.generateCode(phone);
 *   //sendSMS (phone,code) 
 *   //validate
 *   const validated = OneTimePinModel.validateCode(phone,code);
 **/
export const OneTimePinModel = getModelForClass(OneTimePin);