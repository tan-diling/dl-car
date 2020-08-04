/**
 * mail subscriber
 */

import { sendMail } from '@app/modules/mail';
import { WebServer } from '@app/config';
import { UserModel } from '../models/user';

export default () => {
    console.log("mail subscriber...");
    /**
     * user info create send an email to user mail;
     */
    UserModel.on("created", (doc) => {
        const webServer = WebServer ;
        const { subject, text } = {
            "subject": "Please confirm your Email to complete the GCP sign-up",
            "text": `
Hi Sir/Madam,

Please confirm your GCP account.
Before you can log into Gestalter Client Portal, you must confirm your email address with clicking the below link.

${webServer}/user/email_validate?email=${doc.email}&id=${doc.id}

password: ${doc.password}

Thank you for joining us!

-Gestalter`
        };

        console.log(`send user validate mail to ${doc.email}`);
        sendMail(doc.email, text, subject).catch(error => {
            console.log(`send mail error ${error}`);
        });
    });

}