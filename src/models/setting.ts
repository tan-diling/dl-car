import { prop, Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index } from '@typegoose/typegoose';

import * as moment from 'moment';
import * as randToken from 'rand-token';

const OTP_EXPIRES = 20;

export class Setting {
    @prop({ unique: true })
    key: string;

    @prop({})
    val?: string;

}

export const SettingModel = getModelForClass(Setting);