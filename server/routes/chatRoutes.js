import express from "express";
import { ChatOpenAI } from "@langchain/openai"
import { chatBot } from "../OpenAI.js";


const routes = express.Router();

const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
})

const chatBotAi = new chatBot()

routes.options('/chat', function(req, res, next){
    res.header('Allow', 'POST');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
});

routes.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next()
})


routes.get('/joke', async (req, res) => {
    const joke = await model.invoke('Can you tell me a funny javascript joke?')

    res.json(joke)
})

routes.post('/chat', async (req, res) => {
    if (req.body.content === undefined) {
        res.sendStatus(400)
        console.log(req)
        return;
    }
    const content = req.body.content
    //
    // res.json({content: req.body.content})

    // const GPTresponse = await model.invoke(content)

    const GPTresponse = await chatBotAi.engineeredPrompt(content)


    res.json(GPTresponse)
})


export default routes