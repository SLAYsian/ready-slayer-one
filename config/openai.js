const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API,
});

const openai = new OpenAIApi(configuration);

module.exports = openai;