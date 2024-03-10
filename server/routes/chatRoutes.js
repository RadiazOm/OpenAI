import express from "express";
import { ChatOpenAI } from "@langchain/openai"
import { FakeListChatModel } from "@langchain/core/utils/testing"
import { chatBot } from "../OpenAI.js";
import * as stream from "stream";
import {isFsReadStream} from "openai/_shims/index";
import {readableStreamAsyncIterable} from "openai/streaming";


const routes = express.Router();

const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
})

const fakeModel = new FakeListChatModel({
    responses: ["Goofy ah", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla mollis sem ac mauris fermentum sodales. In faucibus euismod erat, nec faucibus quam lacinia ac. Etiam hendrerit nibh nec leo semper luctus. Fusce fringilla efficitur diam, in fermentum massa sodales non. Suspendisse tempor maximus odio, ut congue nulla venenatis et. Duis sem nisl, bibendum et finibus eu, gravida eget mi. Vestibulum eget arcu vel diam volutpat sollicitudin.\n" +
    "\n" +
    "Nam sollicitudin lorem felis, a placerat magna molestie sed. Pellentesque mollis, mi non fringilla sagittis, purus leo molestie felis, sit amet tincidunt dui justo eget tortor. Aliquam vitae lacus quis arcu sodales congue ac a elit. Donec eleifend placerat est, accumsan ornare nibh tempor non. Vivamus fermentum lorem ut nisl auctor, at varius lacus faucibus. Quisque feugiat non ipsum sit amet faucibus. Integer lorem lectus, bibendum eget tempus a, vehicula id nunc.\n" +
    "\n" +
    "Proin id semper libero. Ut porta ipsum et lorem commodo, vitae vehicula erat bibendum. Cras et dignissim lectus, nec lobortis arcu. Fusce id risus a erat scelerisque lacinia. Nullam molestie tempus laoreet. Aliquam velit enim, condimentum ut fermentum sed, dapibus vel justo. Nulla ultrices lobortis urna dapibus laoreet. In hac habitasse platea dictumst. Curabitur efficitur venenatis nunc, at iaculis purus elementum in. Nam laoreet tincidunt quam, a placerat lectus convallis nec. Pellentesque vel imperdiet urna, sit amet dignissim ex. Nulla nulla arcu, lacinia et mauris vel, vehicula fermentum libero. Sed tristique sagittis ante, ac dapibus lacus.\n" +
    "\n" +
    "Sed ante massa, posuere sit amet faucibus in, facilisis non mi. Integer placerat diam nulla, sit amet dignissim diam posuere a. Nam libero leo, pellentesque quis velit ac, bibendum pulvinar metus. Aenean velit risus, imperdiet eu pulvinar eu, facilisis vel dui. Sed erat dolor, rutrum non justo sed, consequat laoreet augue. Donec bibendum tellus quis volutpat viverra. Morbi a mi justo.\n" +
    "\n" +
    "Vivamus in ipsum fermentum, lacinia ante ut, mattis sem. Cras ut enim pellentesque, consequat ipsum at, commodo nisl. Etiam a vulputate leo, id ullamcorper orci. Ut venenatis risus ligula, nec dapibus dolor tristique et. Vivamus id sollicitudin massa. Vestibulum tristique blandit lorem. Nullam eleifend diam nec nisl pulvinar pretium. Curabitur ullamcorper urna condimentum nulla lobortis auctor. Sed sit amet sapien augue."]
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
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
    })
    const content = req.body.content
    const history = req.body.history
    //
    // res.json({content: req.body.content})

    // const GPTresponse = await model.invoke(content)

    // const GPTresponse = await chatBotAi.engineeredPrompt(content, history)

    const chatHistory = await chatBotAi.engineeredPrompt(content, history)

    const stream = await model.stream(chatHistory)
    for await (const chunk of stream) {
        res.write(chunk.content)
    }

    res.end()
})

routes.get('/stream', async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
    })

    const stream = await fakeModel.stream("Write an introduction for a book about a colony of tiny hamsters.")
    for await (const chunk of stream) {
        res.write(chunk.content)
    }

    res.end()
})


export default routes