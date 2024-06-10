import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[]
}

interface Attachment {
  filename: string;
  path: string;
}

export class EmailService{
  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    }
  });

  constructor(){}

  async sendEmail(options: SendMailOptions):Promise<boolean>{
    const {to, subject, htmlBody, attachments = []} = options;

    try {

      const SentInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachments,
      });

      //console.log(SentInformation);

      const log = new LogEntity({
        level: LogSeverityLevel.low,
        message: 'Email sent',
        origin: 'email.servie.ts',
      });

      return true

    } catch (error) {
      
      const log = new LogEntity({
        level: LogSeverityLevel.high,
        message: 'Email not sent',
        origin: 'email.servie.ts',
      });

      return false
    }
  }

  async sendEmailWithFileSystemLogs( to: string | string[] ){
    const subject = 'Logs del servidor';
    const htmlBody = `
      <h3>Logs de sistema - NOC</h3>
      <p>Laborum tempor do ut qui do est. Ullamco proident veniam magna laborum ullamco aliqua velit. Dolor laborum et eiusmod incididunt aliquip. Occaecat quis sint dolor aute aliqua qui nisi sit deserunt amet ut voluptate. Non consequat esse ullamco ex consequat cillum quis. Aute enim officia sunt consequat anim sit amet nostrud.</p>
      <p>Ver logs adjuntos</p>
    `;
    const attachments:Attachment[] = [
      { filename: 'logs-all.log', path: './logs/logs-all.log'},
      { filename: 'logs-medium.log', path: './logs/logs-medium.log'},
      { filename: 'logs-all-high.log', path: './logs/logs-high.log'},
    ]

    return this.sendEmail({
      to, subject, attachments, htmlBody
    })
  }

}