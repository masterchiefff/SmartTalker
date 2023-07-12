const express = require('express');

const dotenv = require('dotenv')

dotenv.config();

const app = express();

const credentials = {
    apiKey: process.env.apiKey,
    username: process.env.username
}

const AfricasTalking = require('africastalking')(credentials);

console.log(process.env.username)

module.exports = function smsServer() {
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    const sms = AfricasTalking.SMS;

    app.post('/', (req, res) => {
        const { to, message } = req.body || res.status(400).json({error: "Both 'to' and 'message' are required"});
        sms.send({to, message, enque: true})
        .then(response => {
            console.log(response);
            res.json(response);
          })
          .catch(error => {
            console.log(error);
            res.json(error.toString());
          });
    })

    const port = process.env.PORT;

    app.listen(port, () => {
        console.log(`App running on port: ${port}`);

    });
};