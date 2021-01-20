/**
 * in project
 * ```
 * npm install ./packages/login
 * ```
 */

require('module-alias/register');

import { sendMail } from '@app/modules/mail';


async function run() {
    const receiver = 'tan.yw@dealing.tech';
    const ret = await sendMail({ email: receiver, subject: 'test', text: new Date().toISOString() });

    console.log(`${receiver} result:${ret}`);
};

run()
