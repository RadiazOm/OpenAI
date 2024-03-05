import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {


    const [handling, setHandling] = useState(false)

    const [buttonLocked, setButtonLocked] = useState('')

    const [response, setResponse] = useState('')

    const [input, setInput] = useState('')
    const inputChange = (event) => {
        setInput(event.target.value)
    }

    const handleRequest = async (event) => {
        event.preventDefault();
        if (handling === true) {
            return;
        }
        console.log(handling);
        setHandling(true)
        setButtonLocked('opacity-50 cursor-not-allowed')

        await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: event.target[0].value
            })
        })
            .then((response) => response.json())
            .then((data) => dataIsLoaded(data))
            .catch((error) => console.log('data couldnt load: ' + error))
    }

    const dataIsLoaded = (data) => {
        setResponse(data.kwargs.content)
        setHandling(false)
        setButtonLocked('')
    }

    return (
        <>
            <form method="post" onSubmit={handleRequest}>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="query">Ask me a question!</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="query" type="text" name="query" placeholder="Ask a question!" value={input} onChange={inputChange}/>

                <button className={buttonLocked} disabled={handling} type="submit">Send</button>
            </form>
            <div>
                <p>{response}</p>
            </div>
        </>
    )
}

export default App
