/**
 * mail subscriber
 */
import { UserModel, Operation } from '@packages/mongoose';

import { sendMail } from '@packages/mail';
import { config_get } from '@packages/core';

export default () => {
    console.log("mail subscriber...");
    /**
     * user info create send an email to user mail;
     */
    UserModel.on(Operation.Created, (doc) => {
        const webServer = config_get('webServer') || "http://localhost:3000/api";
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