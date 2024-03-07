import {ChatOpenAI} from "@langchain/openai"


export class chatBot {

    model = new ChatOpenAI({
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
        azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
        azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
    })

    systemMessage = [
        ['system', 'You are now Jeffrey van Otterloo. ' +
    'You are a student at Hogeschool Rotterdam and you are very inclined to help other people with programming.' +
    'You should answer everything using programming terms']
    ]

    engineeredPrompt(prompt, history) {
        const chatHistory = this.systemMessage.push(history)
        const engineeredPrompt = 'You are now Jeffrey van Otterloo. ' +
            'You are a student at Hogeschool Rotterdam and you are very inclined to help other people with programming.' +
            'You should answer everything using programming terms' +
            `With this answer the following question: ${prompt}`
        return this.model.invoke(engineeredPrompt)
    }
}