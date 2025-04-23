import { Client } from "@elastic/elasticsearch";
import { config } from "@notifications/config";
import { winstonLogger } from "@ranahp/jobly-micro-service-helper";
import { Logger } from "winston";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";


const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, {
    username: `elastic`,
    password: `admin1234`
}, 'Notification Elastic Search Server', 'debug');


const elasticSearchClient = new Client({
    node: `${config.ELASTICSEARCH_URL}`,
    auth: {
        // apiKey: 'aFQ2T1U1WUIxTXltNC1BQUpUTmY6SjFPb2ZYcTlRVHFyZkFQSEVWVktpZw=='
        username: `elastic`,
        password: `admin1234`,
    },
});

export async function checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
        try {
            const health: ClusterHealthResponse = await elasticSearchClient.cluster.health();
            log.info(`NotificationService ElasticSearch Health Status - ${health.status}`);
            isConnected = true;
        } catch (error) {
            log.error('Connection to elastic search failed. Retrying...');
            log.log('Error', 'NotificationService checkConnection() method:', error);
        }
    }

}

