/**
 * in project
 * ```
 * npm install ./packages/login
 * ```
 */

require('module-alias/register') ;

import {sendValidateMail } from '@packages/mail';


async function run() {
    const receiver = 'tan.yw@dealing.tech';
   const ret = await sendValidateMail(receiver,new Date().toISOString()) ;

   console.log(`${receiver} result:${ret}`) ;
};

run()
