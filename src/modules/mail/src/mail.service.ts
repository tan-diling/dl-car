/**
 * mail service 
 * @packageDocumentation
 */
import { createTransport, TransportOptions } from 'nodemailer';
import { logger } from '@app/config';

import { Mail_Server_Host, Mail_Server_User, Mail_Server_Password } from '@app/config';



// mail: mail.nicjob.com
// username: do-not-reply@nicjob.com
// pass: 4Il0IIlHR2KpHP5AOtV7gRMiU7wlz
// smtp: my.modestlab.com:587
// imap: my.modestlab.com:993 


const transportOption = {
  host: Mail_Server_Host,
  // port: 465,
  // secure: true, // true for 465, false for other ports
  auth: {
    user: Mail_Server_User,
    pass: Mail_Server_Password,
  },
  debug: true,
  log: true,
  transactionLog: true,
};

logger.info(transportOption);

// const transportOption_google = {
//   host: 'gmail.google.com',
//   port: 465,
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: 'dev@nicjob.com',
//     pass: 'gvE85vZblylGB*qp4%ZXJwRV', 
//   },
//   debug: true ,
//   log : true ,
//   transactionLog: true ,
// };


/**
 * send email
 * @param email target mail
 * @param subject mail title
 * @param html mail detail
 */
export async function sendMail(email: string, html: string, subject: string = 'NOREPLY') {

  // create reusable transporter object using the default SMTP transport
  const transporter = createTransport(transportOption);

  const mailOptions = {
    from: transportOption.auth.user, // sender
    to: email, // receiver
    subject, // title
    text: html,
    // html,
  };

  try {
    const mailResult = await transporter.sendMail(mailOptions);
    return mailResult;
  }
  catch (err) {
    console.error(`mail send error ${err}`);
    return { error: err };
  }



}