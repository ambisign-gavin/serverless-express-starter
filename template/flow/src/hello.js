// @flow
import express, { type $Request, type $Response } from 'express';


const helloController = () => {
    const app = express();

    app.get('/hello', (req: $Request, res: $Response) => {
        res.status(200).send('Hello!');
        return;
    });

    return app;
};

export default helloController;