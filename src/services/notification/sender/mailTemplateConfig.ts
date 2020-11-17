import { EntityContext, Entity, ProjectEntity } from '../entity/entityContext';
import { ResourceType } from '@app/defines';

/**
 * mail template define
 */
function generateHTML(data: { name: string, content: string, url: string }) {
    const link = !data.url ? "" : ` 
<div class="btn"
    style="padding: 0 40px;background: #0063ff;box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);border-radius: 8px;text-align: center;color: #ffffff;height: 40px;line-height: 40px;display: inline-block;margin-top: 28px;cursor: pointer;"
    >
  <!-- button -->
  <a style="text-decoration:none;color: #ffffff;"  href="${data.url}" >Show details</a>
</div>`;

    const Mail_Layout =
        `
<!DOCTYPE html>
  <html lang="en">
    <head>
      <!-- Required meta tags -->
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

      <title>Gestalter Mail Layout</title>
    </head>
    <body>
      <div
        class="root"
        style="font-size: 14px;color: #2f2f2f;font-family: Poppins;padding: 40px 80px;max-width: 480px;"
        >
        <div
          style="
          box-sizing: border-box;
          border-bottom: 1px solid #dee2e6;
          display: flex;
          align-items: center;
          height: 72px;
          "
          >
          <img
            style="width: 20px; height: 20px; margin-right: 6px"
            src="https://dev.onwards.ai/assets/image/gest-logo.png"
            class="float-left"
            alt="logo"
           />
          <div style="font-weight: 500">Gestalter</div>
        </div>
        <div class="container" style="margin: 20px 0px">          
          <div
          class="head"
          style="
          font-weight: bold;
          font-size: 20px;
          line-height: 34px;
          margin: 32px 0 12px;
          "
          >
          <!-- hi name -->
          Hi ${data.name},
          </div>
          <div class="content" style="font-weight: 500; line-height: 24px; max-width: 360px">
          <!-- mgs content -->
          ${data.content}          
          </div>
        
          ${link}
        </div>
        <div
          style="
          box-sizing: border-box;
          border-top: 1px solid #dee2e6;
          line-height: 24px;
          margin-top: 40px;
          "
          >
          <div style="margin-top: 12px">Thank you,</div>
          <div style="margin-top: 12px">-Gestalter</div>
        </div>
    </div>
  </body>
</html>        

`;
    return Mail_Layout;
}


export const mailTemplateConfig = {
    invitation: (ctx: any) => {
        const { user, server, doc } = ctx;
        const url = `${server}/project/dashboard?actionId=${doc._id}&userId=${user._id}`;
        switch (doc.__t || doc.type) {
            case "InvitationContact":
                return {
                    "subject": "Please confirm the contact invitation ",
                    "html": generateHTML({
                        name: user.name,
                        content: `You have been invited as contact for ${doc.data.name}, please click the below link to view.`,
                        url,
                    }),
                };
                break;
            case "InvitationGroup":
                return {
                    "subject": "Please confirm the group invitation ",
                    "html": generateHTML({
                        name: user.name,
                        content: `You have been invited to join group ${doc.data.name}, please click the below link to view.`,
                        url,
                    }),
                };
                break;

            case "InvitationProject":
                return {
                    "subject": "Please confirm the project invitation ",
                    "html": generateHTML({
                        name: user.name,
                        content: `You have been invited to join project ${doc.data.name}, please click the below link to view.`,
                        url,
                    }),
                };
                break;
        }

    },

    entity: (ctx: any) => {
        const { user, server, doc } = ctx;
        const entityContext = doc as EntityContext<Entity>;
        const entity = entityContext.entity;
        const project = (entity.parents[0] || entity) as ProjectEntity;
        const entityKey = entity.parents.length == 0 ? `${project.key} ` : `${project.key} -${entity.seq} `;

        const body = entityContext.req?.body;
        let desc = body?._desc || "";

        let action = entityContext.method;
        if (action == "member.append") {
            action = "add member";
            action = action + ` ${body._user.name} `;
        } else if (action == "member.remove") {
            action = "delete member";
            action = action + ` ${body._user.name} `;
        } else if (action == "assignee.append") {
            action = "add assignee";
            action = action + ` ${body._user.name} `;
        } else if (action == "assignee.remove") {
            action = "delete assignee";
            action = action + ` ${body._user.name} `;
        } else {
            if (desc == "") {
                const updateList = [];
                if (body) {
                    for (const k of Object.keys(body)) {
                        if (k.startsWith('_')) continue;
                        if (k == 'id') continue;
                        updateList.push(`<div><span style="text-transform:capitalize!important;">${k}:</span> <span >${body[k]}</span><div> `);
                    }
                }

                desc = `${updateList.join(' ')}`;

            }
        }

        const subject = `[GCP](${entityKey}) ${entity.type} '${entity.title}' ${action} `;

        let url = '';
        const entityType = entity.type.toLowerCase();
        switch (entityType) {
            case ResourceType.Project:
                url = `${server}/project/detail/${entity._id}?userId=${user._id}`;
                break;
            case ResourceType.Goal:
            case ResourceType.Requirement:
            case ResourceType.Deliverable:
            case ResourceType.Task:
                url = `${server}/project/${project._id}/${entityType}/${entity._id}?userId=${user._id}`;
                break;

        }
        return {
            "subject": subject,
            "html": generateHTML({
                name: user.name,
                content: `     <div>'${entity.title}' ${action} by ${entityContext.user.name} </div> <div> ${desc} </div>`,
                url,
            }),
        };

    },

    forgetPassword: (ctx: any) => {
        const { user, server, doc } = ctx;
        return {
            "subject": "Reset your password",
            "html": generateHTML({
                name: user.name,
                content: `     <div>We received a request to reset your password after confirming the verification code.Your GCP verification code is: </div> <h3>${doc.code} </h3>Please do not forward or give this code to anyone.`,
                url: '',
            }),
        };
    }

}