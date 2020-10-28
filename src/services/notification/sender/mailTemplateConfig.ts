import { EntityContext, Entity, ProjectEntity } from '../entity/entityContext';
import { ResourceType } from '@app/defines';

/**
 * mail template define
 */
export const mailTemplateConfig = {
    invitation: (ctx: any) => {
        const { user, server, doc } = ctx;
        switch (doc.__t || doc.type) {
            case "InvitationContact":
                return {
                    "subject": "Please confirm the contact invitation ",
                    "html": `
Hi Sir/Madam,

You have been invited as contact for ${doc.data.name}, please click the below link to view.

URL: ${server}/project/dashboard?actionId=${doc._id}&userId=${user._id}

Thank you for joining us!

- Gestalter`
                };
                break;
            case "InvitationGroup":
                return {
                    "subject": "Please confirm the group invitation ",
                    "html": `
Hi Sir/Madam,

You have been invited to join group ${doc.data.name}, please click the below link to view.

URL: ${server}/project/dashboard?actionId=${doc._id}&userId=${user._id}

Thank you for joining us!

- Gestalter`
                };
                break;

            case "InvitationProject":
                return {
                    "subject": "Please confirm the project invitation ",
                    "html": `
Hi Sir/Madam,

You have been invited to join project ${doc.data.name}, please click the below link to view.

URL: ${server}/project/dashboard?actionId=${doc._id}&userId=${user._id}

Thank you for joining us!

- Gestalter`
                };
                break;

        }

    },

    entity: (ctx: any) => {
        const { user, server, doc } = ctx;
        const entityContext = doc as EntityContext<Entity>;
        const entity = entityContext.entity;
        const project = (entity.parents[0] || entity) as ProjectEntity;
        const entityKey = entity.parents.length == 0 ? `${project.key}` : `${project.key}-${entity.seq}`;
        const subject = `[GCP] (${entityKey}) ${entity.type} ${entity.title} ${entityContext.method}`;
        const desc = entityContext.req?.body?._desc;
        let url = '';
        const entityType = entity.type.toLowerCase();
        switch (entityType) {
            case ResourceType.Project:
                url = `${server}/project/detail/${entity._id}`;
                break;
            case ResourceType.Goal:
            case ResourceType.Requirement:
            case ResourceType.Deliverable:
            case ResourceType.Task:
                url = `${server}/project/${project._id}/${entityType}/${entity._id}`;
                break;

        }
        return {
            "subject": subject,
            "html": `
Hi ${user.name},

${subject} ${desc}

url: ${url}

- Gestalter`
        };

    },

    forgetPassword: (ctx: any) => {
        const { user, server, doc } = ctx;
        return {
            "subject": "Reset your password",
            "html": `
Hi ${user.name},
We received a request to reset your password after confirming the verification code. Your GCP verification code is:

${doc.pin}

Please do not forward or give this code to anyone.

Thank you,

-Gestalter`
        };
    }

}