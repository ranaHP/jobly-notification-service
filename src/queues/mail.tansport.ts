import { config } from "@notifications/config";
import { emailTemplate } from "@notifications/helper";
import { IEmailLocals, winstonLogger } from "@ranahp/jobly-micro-service-helper";
import { Logger } from "winston";

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, {
    username: `elastic`,
    password: `admin1234`
}, 'notificationQueueConnection', 'debug');


async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
    try {
        await emailTemplate(template, receiverEmail, locals)
        log.info(`NotificationService sendEmail() Successfully called`);
    } catch (error) {
        log.log('error', `NotificationService MailTranspoter sendEmail() method  error:` + error);
    }
}


export { sendEmail }
