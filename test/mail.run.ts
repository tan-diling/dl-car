/**
 * in project
 * ```
 * npm install ./packages/login
 * ```
 */

require('module-alias/register') ;

import {sendMail } from '@app/modules/mail';


async function run() {
    const receiver = 'tan.yw@dealing.tech';
   const ret = await sendMail(receiver,new Date().toISOString()) ;

   console.log(`${receiver} result:${ret}`) ;
};

run()
