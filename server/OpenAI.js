export class chatBot {
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
        if (history.length !== 0) {
            chatHistory.push(...history)
            chatHistory.pop()
        }
        let programmingJoke = await this.getProgrammingJoke()
        let engineeredPrompt = `Answer the following question as Jeffrey van Otterloo: ${prompt} but end the explanation with the following programming joke: ${programmingJoke.joke}. Do not explain the joke`
        chatHistory.push(['human', engineeredPrompt])
        console.log(chatHistory)
        return chatHistory
    }
}