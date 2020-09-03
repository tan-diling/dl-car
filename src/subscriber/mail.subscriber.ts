/**
 * mail subscriber
 */

import { sendMail } from '@app/modules/mail';
import { WebServer } from '@app/config';
import { UserModel, User } from '../models/user';
import { GroupMemberModel, GroupMember } from '@app/models/group';
import { RepoOperation } from '@app/defines';
import { ProjectMember, ProjectMemberModel } from '@app/models/project';

export default () => {
    console.log("mail subscriber...");
    /**
     * when user created, send user validate email 
     */
    UserModel.on(RepoOperation.Created, (doc:User) => {
        
        const email = doc.email ;
        const { subject, text } = buildMailOfUserConfirm( doc);

        sendMail(email, text, subject).catch(error => {
            console.log(`send mail error ${error}`);
        });
    });


    /**
     * when group member created, send user confirm join email 
     */
    GroupMemberModel.on(RepoOperation.Created, (doc:GroupMember) => {
        // const user = UserModel.findById(doc.userId) ;
        const email = doc.email ;
        const { subject, text } = buildMailOfGroupMemberConfirm( doc);

        sendMail(email, text, subject).catch(error => {
            console.log(`send mail error ${error}`);
        });
    });

    /**
     * when project member created, send user confirm join email 
     */
    ProjectMemberModel.on(RepoOperation.Created, async (doc:ProjectMember) => {
        const user = await UserModel.findById(doc.userId).exec() ;
        const email = user.email ;
        const { subject, text } = buildMailOfProjectMemberConfirm( doc);

        sendMail(email, text, subject).catch(error => {
            console.log(`send mail error ${error}`);
        });
    });
}

/** mail template: user confirm  */
function buildMailOfUserConfirm( doc: any): { subject: string; text: string; } {
    const webServer = WebServer ;
    return {
        "subject": "Please confirm your Email to complete the GCP sign-up",
        "text": `
Hi Sir/Madam,

Please confirm your GCP account.
Before you can log into Gestalter Client Portal, you must confirm your email address with clicking the below link.

${webServer}/user/email_validate?email=${doc.email}&id=${doc.id}

Password: ${doc.password}

Thank you for joining us!

- Gestalter`
    };
}

/** mail template: group member confirm  */
function buildMailOfGroupMemberConfirm(doc: any): { subject: string; text: string; } {
    const webServer = WebServer ;
    return {
        "subject": "Please confirm the group invitation ",
        "text": `
Hi Sir/Madam,

You have been invited to join a group, please click the below link to view.

URL: ${webServer}/group/confirm/${doc.groupId}

Thank you for joining us!

- Gestalter`
    };
}


/** mail template: project member confirm  */
function buildMailOfProjectMemberConfirm(doc: any): { subject: string; text: string; } {
    const webServer = WebServer ;
    return {
        "subject": "Please confirm the project invitation ",
        "text": `
Hi Sir/Madam,

You have been invited to join a project, please click the below link to view.

URL: ${webServer}/project/confirm/${doc.projectId}

Thank you for joining us!

- Gestalter`
    };
}

