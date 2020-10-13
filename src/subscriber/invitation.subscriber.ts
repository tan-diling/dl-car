// /**
//  * mail subscriber
//  */

// import { sendMail } from '@app/modules/mail';
// import { WebServer } from '@app/config';
// import { UserModel, User } from '../models/user';
// import { GroupMemberModel, GroupMember, PendingActionModel, PendingAction } from '@app/models';
// import { RepoOperation } from '@app/defines';
// import { ProjectMember, ProjectMemberModel } from '@app/models';

// export default () => {
//     console.log("invitation subscriber...");
//     /**
//      * when user created, send user validate email 
//      */
//     PendingActionModel.on(RepoOperation.Created, (doc:PendingAction) => {
        
//         const email = doc.email ;
//         const { subject, text } = buildMailOfUserConfirm( doc);

//         sendMail(email, text, subject).catch(error => {
//             console.log(`send mail error ${error}`);
//         });
//     });
// }

    