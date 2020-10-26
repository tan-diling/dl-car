import { prop, Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index } from '@typegoose/typegoose';

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

        if (otp != null) {
            await otp.remove();
            return otp.pin == code;
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