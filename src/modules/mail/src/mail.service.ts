/**
 * mail service 
 * @packageDocumentation
 */
import { createTransport, TransportOptions } from 'nodemailer';
import { logger, mailConfig } from '@app/config';

/**
 * send email
 * @param email target mail
 * @param subject mail title
 * @param html mail detail
 */
export async function sendMail(options: { email: string, html?: string, subject: string, text?: string }) {

  const transportOption = {
    host: mailConfig.host,
    port: mailConfig.port,
    connectionTimeout: 20 * 1000,
    secure: true, // true for 465, false for other ports
    auth: {
      user: mailConfig.user,
      pass: mailConfig.password,
    },
    debug: true,
    log: true,
    transactionLog: true,
  };

  logger.info(transportOption.auth.user);

  // create reusable transporter object using the default SMTP transport
  const transporter = createTransport(transportOption);


  const { email, subject, ...contentOptions } = options;
  let mailOptions = {
    from: transportOption.auth.user, // sender
    to: email, // receiver
    subject: subject, // title
    ...contentOptions,
  };

  try {
    const mailResult = await transporter.sendMail(mailOptions);
    return mailResult;
  } catch (err) {
    console.error(`mail send error ${err}`);
    return { error: err };
  }



}