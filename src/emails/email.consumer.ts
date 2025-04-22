import { Channel, ConsumeMessage } from 'amqplib';
import { config } from "@notifications/config";
import { winstonLogger } from "@ranahp/jobly-micro-service-helper";
import { Logger } from "winston";
import { createConnection } from '@notifications/queues/connecion';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, {
    username: `elastic`,
    password: `admin1234`
}, 'notificationQueueConnection', 'debug');


async function connectAuthEmailMessage(channel: Channel): Promise<void> {
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
                    const content = JSON.parse(message.content.toString());
                    log.info(`NotificationService auth email consume received message:`);
                    console.log(content);
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

export { connectAuthEmailMessage };