
import { Event, EventModel, Notification, NotificationModel } from '@app/models/notification';
import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InvitationContact, InvitationGroup, InvitationProject } from '@app/models';
import Container from 'typedi';
import { NotificationSenderInterface, NotificationSenderOptions } from './types';


class DbNotificationSender implements NotificationSenderInterface {
    async execute(data: NotificationSenderOptions) {
        await NotificationModel.create(data);
    }
}

export const dbNotificationSender = Container.get(DbNotificationSender);