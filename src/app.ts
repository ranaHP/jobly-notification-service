import { winstonLogger } from "@ranahp/jobly-micro-service-helper";
import { config } from "@notifications/config";
import { Logger } from "winston";
import {start} from "@notifications/server";
import express, { Express } from "express";

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`,{
    username: `elastic`,
    password: `admin1234`
}, 'NotificationService', 'debug');

function initialized(): void {
    const app: Express = express();
    start(app);
    log.info(`NotificationService Initialized`);
}

initialized();