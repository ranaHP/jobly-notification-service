
import * as connection from '@notifications/queues/connecion';
import amqp from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';

jest.mock('@notifications/queues/connecion');
jest.mock('amqplib');

jest.mock('@ranahp/jobly-micro-service-helper');

describe('Email Consumer', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('consumeAuthEmailMessages method', () => {
        it('should be called', async () => {
            const channel = {
                assertExchange: jest.fn(),
                publish: jest.fn(),
                assertQueue: jest.fn(),
                bindQueue: jest.fn(),
                consume: jest.fn(),
            };
            jest.spyOn(channel, 'assertExchange');
            jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'auth-email-queue', messageCount: 0, consumerCount: 0 });
            jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);
            const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
            await consumeAuthEmailMessages(connectionChannel!);
            expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('jobly-email-notification-exchange', 'direct', { durable: true });
            expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
            expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
            expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('auth-email-queue', 'jobly-email-notification-exchange', 'auth-email');
        });
    });

    describe('consumeOrderEmailMessages method', () => {
        it('should be called', async () => {
            const channel = {
                assertExchange: jest.fn(),
                publish: jest.fn(),
                assertQueue: jest.fn(),
                bindQueue: jest.fn(),
                consume: jest.fn(),
            };
            jest.spyOn(channel, 'assertExchange');
            jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'order-email-queue', messageCount: 0, consumerCount: 0 });
            jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);
            const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
            await consumeOrderEmailMessages(connectionChannel!);
            expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('jobly-order-notification-exchange', 'direct', { durable: true });
            expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
            expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
            expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('order-email-queue', 'jobly-order-notification-exchange', 'order-email');
        });
    });
});
