import { prop, Ref, plugin, getModelForClass, getDiscriminatorModelForClass, index } from '@typegoose/typegoose';

export class Setting {
    @prop({ unique: true })
    key: string;

    @prop({})
    val?: any;

}

export const SettingModel = getModelForClass(Setting);