const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require('dotenv')

dotenv.config();

const app = express();

const credentials = {
    apiKey: process.env.apiKey,
    username: process.env.username
}

const configuration = new Configuration({
    organization: process.env.openAIOrganisation,
    apiKey: process.env.openAIKey,
})

const openai = new OpenAIApi(configuration);

const AfricasTalking = require('africastalking')(credentials);

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

    app.post('/sms', async (req, res) => {
        const prompt = req.body.prompt;

        try {
          if (prompt == null) {
            throw new Error("no prompt was provided");
          }

          const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
          });
          
          const completion = response.data.choices[0].text;
          console.log(response.data)
          return res.status(200).json({
            success: true,
            message: completion,
          });
        } catch (error) {
          console.log(error.message);
        }
    })

    const port = process.env.PORT;

    app.listen(port, () => {
        console.log(`App running on port: ${port}`);

    });
};