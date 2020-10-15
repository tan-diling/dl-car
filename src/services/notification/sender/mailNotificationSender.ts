import { Event, EventModel, Notification, NotificationModel } from '@app/models/notification';
import { DocumentType, types } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InvitationContact, InvitationGroup, InvitationProject, UserModel } from '@app/models';
import Container from 'typedi';
import { NotificationTopic, NotificationAction } from '@app/defines';
import { NotificationSenderInterface } from './types';
import { sendMail } from '@app/modules/mail';
import { WebServer } from '@app/config';
import { mailTemplateConfig } from './mailTemplateConfig';


class MailNotificationSender implements NotificationSenderInterface {
    async buildMailInfo(data: { receiver: Types.ObjectId, template?: string, data?}) {
        const user = await UserModel.findById(data.receiver).exec();

        const mailTemplateFunction: (ctx) => { subject: string, html: string } = mailTemplateConfig[data.template];
        if (user && mailTemplateFunction) {
            const mailInfo = mailTemplateFunction({ user,server:WebServer, doc: data.data });
            return { email: user.email, ...mailInfo };
        }
    }

    async execute(data: { receiver: Types.ObjectId, template?: string, data?}) {

        const mailInfo = await this.buildMailInfo(data);
        const { email, subject, html } = mailInfo;
        sendMail(email, html, subject,).catch(error => {
            console.log(`send mail error ${error}`);
        });
    }
}



export const mailNotificationSender = Container.get(MailNotificationSender);