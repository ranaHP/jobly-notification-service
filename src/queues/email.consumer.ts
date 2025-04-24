import { Channel, ConsumeMessage } from 'amqplib';
import { config } from "@notifications/config";
import { IEmailLocals, winstonLogger } from "@ranahp/jobly-micro-service-helper";
import { Logger } from "winston";
import { createConnection } from '@notifications/queues/connecion';
import { sendEmail } from '@notifications/queues/mail.tansport';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, {
    username: `elastic`,
    password: `admin1234`
}, 'notificationQueueConnection', 'debug');

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
    try {
        if (!channel) {
            channel = await createConnection() as Channel;
        }

        const exchangeName = 'jobly-email-notification-exchange';
        const routingKey = 'auth-email';
        const queueName = 'auth-email-queue';

        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        const joblyQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
        await channel.bindQueue(joblyQueue.queue, exchangeName, routingKey);
        channel.consume(joblyQueue.queue, async (message: ConsumeMessage | null) => {
            if (message) {
                try {
                    log.info(`NotificationService auth email consume received message:`);
                    const messageAsString = message.content.toString();
                    const emailData = JSON.parse(JSON.parse(messageAsString));

                    const locals: IEmailLocals = {
                        appLink: `${config.CLIENT_URL}`,
                        appIcon: `${config.CLIENT_LOGO}`,
                        username: emailData.username,
                        verifyLink: emailData.verifyLink,
                        resetLink: emailData.resetLink,
                    };

                    await sendEmail(emailData.template, emailData.receiverEmail, locals);
                    channel.ack(message);
                } catch
                (error) {
                    log.error(`NotificationService connectAuthEmailMessage() method:` + error);
                }
            }
        }, { noAck: false });

    } catch (error) {
        log.error(`NotificationService connectAuthEmailMessage() method:` + error);
    }

}

async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
    try {
        if (!channel) {
            channel = await createConnection() as Channel;
        }

        const exchangeName = 'jobly-order-notification-exchange';
        const routingKey = 'order-email';
        const queueName = 'order-email-queue';

        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        const joblyQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
        await channel.bindQueue(joblyQueue.queue, exchangeName, routingKey);
        channel.consume(joblyQueue.queue, async (emailMessage: ConsumeMessage | null) => {
            if (emailMessage) {
                try {
                    const {
                        receiverEmail,
                        username,
                        template,
                        sender,
                        offerLink,
                        amount,
                        buyerUsername,
                        sellerUsername,
                        title,
                        description,
                        deliveryDays,
                        orderId,
                        orderDue,
                        requirements,
                        orderUrl,
                        originalDate,
                        newDate,
                        reason,
                        subject,
                        header,
                        type,
                        message,
                        serviceFee,
                        total
                    } = JSON.parse(JSON.parse(emailMessage!.content.toString()));
                    const locals: IEmailLocals = {
                        appLink: `${config.CLIENT_URL}`,
                        appIcon: `${config.CLIENT_LOGO}`,
                        username,
                        sender,
                        offerLink,
                        amount,
                        buyerUsername,
                        sellerUsername,
                        title,
                        description,
                        deliveryDays,
                        orderId,
                        orderDue,
                        requirements,
                        orderUrl,
                        originalDate,
                        newDate,
                        reason,
                        subject,
                        header,
                        type,
                        message,
                        serviceFee,
                        total
                    };
                    if (template === 'orderPlaced') {
                        await sendEmail('orderPlaced', receiverEmail, locals);
                        await sendEmail('orderReceipt', receiverEmail, locals);
                    } else {
                        await sendEmail(template, receiverEmail, locals);
                    }
                    channel.ack(emailMessage!);
                } catch
                (error) {
                    log.error(`NotificationService connectOrderEmailMessage() method:` + error);
                }
            }
        }, { noAck: false });

    } catch (error) {
        log.error(`NotificationService connectOrderEmailMessage() method:` + error);
    }

}
export { consumeAuthEmailMessages, consumeOrderEmailMessages };