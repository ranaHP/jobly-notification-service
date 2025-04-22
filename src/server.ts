import { Logger } from 'winston';
import { config } from '@notifications/config';
import 'express-async-errors';
import { Application } from 'express';
import http from 'http';
import { winstonLogger } from '@ranahp/jobly-micro-service-helper';
import { healthRoutes } from '@notifications/route';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connecion';
import { Channel } from 'amqplib';
import { connectAuthEmailMessage } from '@notifications//emails/email.consumer';

const SERVER_PORT = config.SERVER_PORT || 4001;
const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, {
    username: `elastic`,
    password: `admin1234`
},'NotificationService', 'debug');

export function start(app: Application): void {
    startServer(app);
    startQueues();
    checkConnection();
    starElasticSearch();
    app.use('', healthRoutes());    // http://localhost:4001/notification-health

}

async function startQueues(): Promise<void> {
    const emailChannel:Channel = await createConnection() as Channel;
    await connectAuthEmailMessage(emailChannel); 

    // await emailChannel.assertExchange('jobly-email-notification-exchange', 'direct', { durable: true });
    // const message = JSON.stringify({ message: 'Hello from Notification Service!' });
    // emailChannel.publish('jobly-email-notification-exchange', 'auth-email', Buffer.from(message));
}

function starElasticSearch() {
    // starElasticSearch();
}


function startServer(app: Application): void {
    try {
        const httpServer: http.Server = new http.Server(app);
        log.info(`Worker with process id of ${process.pid} on notification server has started`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`NotificationService is running on port ${SERVER_PORT}`);
        });

    } catch (error) {
        log.log('Error', 'NotificationService startServer() method: ', error);
    }
}



