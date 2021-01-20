
import { Event, EventModel, Notification, NotificationModel } from '@app/models/notification';
import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InvitationContact, InvitationGroup, InvitationProject } from '@app/models';
import Container from 'typedi';
import { NotificationSenderInterface, NotificationSenderOptions } from './types';
import { socketNotificationSender } from './socketNotificationSender';


class DbNotificationSender implements NotificationSenderInterface {
    async execute(data: NotificationSenderOptions) {
        const notification = await NotificationModel.create(data);

        await socketNotificationSender.execute({ ...data, event: { ...notification.toJSON(), event: data.event } });
        // return notification ;
    }
}

export const dbNotificationSender = Container.get(DbNotificationSender);