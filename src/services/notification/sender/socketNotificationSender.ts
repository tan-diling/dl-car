
import { Event, EventModel, Notification, NotificationModel } from '@app/models/notification';
import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InvitationContact, InvitationGroup, InvitationProject } from '@app/models';
import Container from 'typedi';
import { NotificationSenderInterface, NotificationSenderOptions } from './types';
import { ChatContext, ChatMessageTopic } from '@app/services/socketio/message.socket.service';


class SocketNotificationSender implements NotificationSenderInterface {
    async execute(data: NotificationSenderOptions) {
        await ChatContext.postMessage(data.receiver, { event: ChatMessageTopic.NOTIFICATION, message: data.event });
    }
}

export const socketNotificationSender = Container.get(SocketNotificationSender);