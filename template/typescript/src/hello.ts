import express, { Request, Response, Express } from 'express';

const helloController = (): Express => {
    const app = express();

    app.get('/hello', (req: Request, res: Response) => {
        res.status(200).send('Hello!');
        return;
    });

    return app;
};

export default helloController;