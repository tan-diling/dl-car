
/**
 * mail template define
 */
export const mailTemplateConfig = {
    invitation: (ctx: any) => {
        const { user,server, doc } = ctx;
        switch(doc.__t|| doc.type){
            case "InvitationContact" :
                return {
                    "subject": "Please confirm the contact invitation ",
                    "html": `
Hi Sir/Madam,

You have been invited as contact for ${doc.data.name}, please click the below link to view.

URL: ${server}/project/dashboard?actionId=${doc._id}&userId=${user._id}

Thank you for joining us!

- Gestalter`
                };
                break ;
            case "InvitationGroup" :
                    return {
                        "subject": "Please confirm the group invitation ",
                        "html": `
Hi Sir/Madam,

You have been invited to join group ${doc.data.name}, please click the below link to view.

URL: ${server}/project/dashboard?actionId=${doc._id}&userId=${user._id}

Thank you for joining us!

- Gestalter`
                    };
                    break ;
                    
                case "InvitationProject" :
                    return {
                        "subject": "Please confirm the project invitation ",
                        "html": `
Hi Sir/Madam,

You have been invited to join project ${doc.data.name}, please click the below link to view.

URL: ${server}/project/dashboard?actionId=${doc._id}&userId=${user._id}

Thank you for joining us!

- Gestalter`
                    };
                    break ;

        }        

    }
}