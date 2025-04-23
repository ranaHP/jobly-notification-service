import { IEmailLocals, winstonLogger } from "@ranahp/jobly-micro-service-helper";
import { config } from "@notifications/config";
import { Logger } from "winston";
import nodemailer, { Transporter } from 'nodemailer';
import Email from "email-templates";
const path = require('path');

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, {
    username: `elastic`,
    password: `admin1234`
}, 'Notification Elastic Search Server', 'debug');

async function emailTemplate(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
    try {
        const transporter: Transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: `${config.SENDER_EMAIL}`,
                pass: `${config.SENDER_EMAIL_PASSWORD}`
            }
        });
        const email: Email = new Email({
            message: {
                from: `Jobly Support <${config.SENDER_EMAIL}>`,
            },
            send: true,
            preview: false,
            views: {
                options: {
                    extension: 'ejs'
                }
            },
            transport: transporter,
            juice: true,
            juiceResources: {
                preserveMediaQueries: true,
                webResources: {
                    relativeTo: path.join(__dirname, '../build/emails'),
                    images: true,
                    // images: { cid: true },
                },
            },
        });

        await email.send({
            template: path.join(__dirname, '..', 'src/emails', template.toString()),
            message: {
                to: receiver,
            },
            locals
        });

    } catch (error) {
        log.log('error', `NotificationService MailTranspoter sendEmail() method  error:` + error);
    }

}

export { emailTemplate }