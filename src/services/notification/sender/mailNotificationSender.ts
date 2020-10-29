import { Event, EventModel, Notification, NotificationModel } from '@app/models/notification';
import { DocumentType, types } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InvitationContact, InvitationGroup, InvitationProject, UserModel } from '@app/models';
import Container from 'typedi';
import { NotificationTopic, NotificationAction } from '@app/defines';
import { NotificationSenderInterface, NotificationSenderOptions } from './types';
import { sendMail } from '@app/modules/mail';
import { WebServer } from '@app/config';
import { mailTemplateConfig } from './mailTemplateConfig';


const findUserById = async (id) => {
    return await UserModel.findById(id).exec();
}

class MailNotificationSender implements NotificationSenderInterface {
    async buildMailInfo(data: NotificationSenderOptions) {
        const user = await findUserById(data.receiver);

        const template = data.mailTemplate
        const mailTemplateFunction: (ctx) => Promise<{ subject: string, html: string }> = mailTemplateConfig[template];
        if (user && mailTemplateFunction) {
            const mailInfo = await mailTemplateFunction({ user, server: WebServer, doc: data.event.data, findUserById });
            return { email: user.email, ...mailInfo };
        } else {
            console.error(`mail template error ${data.receiver}--${template}.`)
        }
    }

    async execute(data: NotificationSenderOptions) {

        const mailInfo = await this.buildMailInfo(data);
        const { email, subject, html } = mailInfo;
        sendMail(email, html, subject).catch(error => {
            console.log(`send mail error ${error}`);
        });
    }
}



export const mailNotificationSender = Container.get(MailNotificationSender);