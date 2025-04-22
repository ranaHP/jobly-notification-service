import dotenv from 'dotenv';

dotenv.config({});

class Config {
    public NODE_ENV: string | undefined;
    public CLIENT_URL: string | undefined;
    public RABBITMQ_ENDPOINT: string | undefined;
    public SENDER_EMAIL: string | undefined;
    public SENDER_EMAIL_PASSWORD: string | undefined;
    public ELASTICSEARCH_URL: string | undefined;
    public SERVER_PORT: string | undefined;

    constructor(){
        this.NODE_ENV = process.env.NODE_ENV || '';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
        this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
        this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
        this.ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || '';
        this.SERVER_PORT = process.env.SERVER_PORT || '4001';
    }
}

export const config: Config = new Config();