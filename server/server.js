import express from 'express';
import chatRoutes from './routes/chatRoutes.js'
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', chatRoutes)

app.listen(process.env.EXPRESS_PORT, () => {
    console.log('LISTENING')
})

// import { ChatOpenAI } from "@langchain/openai"
//
// const model = new ChatOpenAI({
//     azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
//     azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
//     azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
//     azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
// })
//
// const joke = await model.invoke("pls help i am stuck grandchamp 1 in champion2 how do i get better")
// console.log(joke.content)