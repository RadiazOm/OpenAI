import {ChatOpenAI} from "@langchain/openai"


export class chatBot {

    model = new ChatOpenAI({
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
        azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
        azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
    })

    async getProgrammingJoke() {
        try {
            const response = await fetch('https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single');

            return await response.json();
        } catch (e) {
            console.log('an error occored with the joke API: ', e)
        }
    }

    async engineeredPrompt(prompt, history) {
        let chatHistory = [
            ['system', 'You are now Jeffrey van Otterloo. ' +
            'You are a student at Hogeschool Rotterdam and you are very inclined to help other people with programming. ' +
            'You should answer everything using programming terms']
        ]
        console.log(chatHistory)
        if (history.length !== 0) {
            chatHistory.push(...history)
            console.log('---------------------')
            console.log(chatHistory)
        }
        let programmingJoke = await this.getProgrammingJoke()
        let engineeredPrompt = `Answer the following question: ${prompt} but end the explanation with the following programming joke: ${programmingJoke.joke}`
        chatHistory.push(['human', engineeredPrompt])
        console.log('---------------------')
        console.log(chatHistory)
        return this.model.invoke(chatHistory)
    }
}