import { prop, Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index } from '@typegoose/typegoose';

import * as moment from 'moment';
import * as randToken from 'rand-token';

const OTP_EXPIRES = 20;

export class OneTimePin {
    @prop({ unique: true })
    key: string;

    @prop({})
    pin?: string;

    @prop({ default: Date.now })
    createTime?: Date;


    static
        async validateCode(key: string, code: string) {
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

    static
        async generateCode(key: string) {
        const pin = randToken.uid(8);
        await OneTimePinModel.remove({ key }).exec();
        const otp = await OneTimePinModel.create({ key, pin });

        return otp.pin;
    }
}


export const OneTimePinModel = getModelForClass(OneTimePin);