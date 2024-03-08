import express from 'express';
import chatRoutes from './routes/chatRoutes.js'
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', chatRoutes)



app.listen(process.env.EXPRESS_PORT, () => {
    console.log('LISTENING')
})

// import { OpenAI } from "openai";
//
// const openai = new OpenAI({
//     temperature: 0.3,
//     apiKey: "not-needed",
//     baseURL: "http://localhost:1234/v1",
// });
//
// async function main() {
//     const completion = await openai.chat.completions.create({
//         messages: [
//             { role: "system", content: "You are a helpful assistant." },
//             { role : "user",  content: "Hello, can you tell me a joke."}
//         ],
//     });
//
//     console.log(completion.choices[0]);
// }
//
// main();
