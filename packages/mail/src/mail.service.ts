import { config_get,logger } from '@packages/core';
import { createTransport, TransportOptions} from 'nodemailer';

// webmail: mail.nicjob.com
// username: do-not-reply@nicjob.com
// pass: 4Il0IIlHR2KpHP5AOtV7gRMiU7wlz
// smtp: my.modestlab.com:587
// imap: my.modestlab.com:993 

const Mail_Server_Host = config_get("mail.host","smtp.gmail.com") ;
const Mail_Server_User = config_get("mail.user","dev@nicjob.com") ;
const Mail_Server_Password = config_get("mail.password","gvE85vZblylGB*qp4%ZXJwRV") ;



const WebSite_Server = config_get("website.server","http://127.0.0.1:3000") 

const transportOption = {
  host: Mail_Server_Host,
  // port: 465,
  // secure: true, // true for 465, false for other ports
  auth: {
    user: Mail_Server_User, 
    pass: Mail_Server_Password,
  },
  debug: true ,
  log : true ,
  transactionLog: true ,
};

console.log(transportOption);
// const transportOption_dealing = {
//   host: 'mail.dealing.tech',
//   port: 465,
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: 'tan.yw@dealing.tech', 
//     pass: '82242237',  
//   },
//   debug: true ,
//   log : true ,
//   transactionLog: true ,
// };


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
export async function sendMail(email: string, html: string,  subject: string = 'NOREPLY' ) {

  // create reusable transporter object using the default SMTP transport
  const transporter = createTransport( transportOption );

  const mailOptions = {
    from: transportOption.auth.user, // sender
    to: email, // receiver
    subject, // title
    // text: 'Hello world',
    html,
  };

  try 
  {
    const mailResult = await transporter.sendMail(mailOptions) ;
    return mailResult ;
  }
  catch(err)
  {
      logger.error(`mail send error ${err}`) ;
    return  {error:err} ;
  }
  

  
}

/**
 * send mail validation
 * @param email email
 * @param code valid type
 */
export async function sendValidateMail(email: string, code: string) {

  const validationUrl = `${WebSite_Server}/validate-mail?code=${code}&email=${email}`;
  const html = `<h2>Mailbox verify</h2>
  <h3>
    <span>code: ${code}</span>
    Please click to validate
    <a href="${validationUrl}">${validationUrl}</a>
  </h3>`;

  return sendMail(email, html,"email validate")    ;

}