import { config } from "@notifications/config";
import { winstonLogger } from "@ranahp/jobly-micro-service-helper";
import client, { Channel, ChannelModel } from "amqplib";
import { Logger } from "winston";

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, {
    username: `elastic`,
    password: `admin1234`
}, 'notificationQueueConnection', 'debug');


async function createConnection (): Promise<Channel | undefined> {
    try{
        const connection: ChannelModel = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
        const channel: Channel = await connection.createChannel();
        log.info(`NotificationService connected to RabbitMQ at ${config.RABBITMQ_ENDPOINT}`);
        closeConnection(channel, connection);
        return channel;
    } catch (error) {
        log.error(`NotificationService createConnection() method:`+ error );
        return undefined;
    }
}

function closeConnection(channel: Channel, connection:ChannelModel): void {
    process.on('SIGINT', async () => {
        await channel.close();
        await connection.close();
        log.info('Notification Service RabbitMQ connection closed');
        process.exit(0);
    });
}

export { createConnection};