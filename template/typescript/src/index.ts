import serverless from 'serverless-http';
import helloController from './hello';

export const hello = serverless(helloController());