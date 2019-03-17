import express from 'express';

const helloController = () => {
    const app = express();

    app.get('/hello', (req, res) => {
        res.status(200).send('Hello!');
    });

    return app;
};

export default helloController;