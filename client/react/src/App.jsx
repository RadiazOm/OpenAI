import { useEffect, useState } from 'react';
import './App.css';
import History from './components/History.jsx';

function App() {
    const [history, setHistory] = useState([]);
    const [handling, setHandling] = useState(false);
    const [buttonLocked, setButtonLocked] = useState('');
    const [response, setResponse] = useState('');
    const [input, setInput] = useState('');
    const [buttonColour, setButtonColour] = useState('bg-blue-500 hover:bg-blue-700');
    const [voiceToggle, setVoiceToggle] = useState(false)

    let synth = window.speechSynthesis
    let voices = window.speechSynthesis.getVoices()

    // Fetch initial history from localStorage
    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('history')) || [];
        setHistory(savedHistory);
    }, []);

    useEffect(() => {
        // Save history to localStorage whenever it changes
        if (history.length === 0) {
            return;
        }
        localStorage.setItem('history', JSON.stringify(history));
    }, [history]);

    const speak = (text) => {
        if (synth.speaking || !voiceToggle) {
            return
        }
        console.log(voiceToggle)
        if (text !== '') {
            let englishVoice = voices.filter(voice => voice.lang === "en-US")
            let utterThis = new SpeechSynthesisUtterance(text)
            utterThis.voice = englishVoice[1]
            synth.speak(utterThis)
        }
    }

    const saveHistory = (message) => {
        setHistory(prevHistory => [...prevHistory, message]);
    };

    const inputChange = (event) => {
        setInput(event.target.value);
    };

    const handleRequest = async (event) => {
        event.preventDefault();
        if (handling) return;

        setHandling(true);
        setButtonLocked('opacity-50 cursor-not-allowed');

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: input,
                    history: history
                })
            });

            saveHistory(['human', input]);

            const data = await response.json();
            dataIsLoaded(data);
        } catch (error) {
            console.log('data could not load: ' + error);
        } finally {
            setHandling(false);
            setButtonLocked('');
        }
    };

    const deleteHistory = () => {
        setHistory([])
        localStorage.setItem('history', JSON.stringify([]));
    }

    const toggleVoice = () => {
        console.log('before ' + voiceToggle)

        setVoiceToggle(!voiceToggle)
        if (voiceToggle) {
            setButtonColour('bg-blue-500 hover:bg-blue-700');
        } else {
            setButtonColour('bg-red-500 hover:bg-red-700');
        }
        console.log('after ' + voiceToggle)
    }

    const dataIsLoaded = (data) => {
        setResponse(data.kwargs.content);
        saveHistory(['ai', data.kwargs.content]);
        speak(data.kwargs.content)
    };

    const historyList = history.map((message, index) => (
        <History key={index} message={message[1]} />
    ));

    return (
        <>
            <button onClick={toggleVoice} className={buttonColour + ' text-white font-bold py-2 px-4 rounded'}>Toggle voice</button>
            <button onClick={deleteHistory} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>delete history</button>
            <form method="post" onSubmit={handleRequest}>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="query">Ask me a question!</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="query" type="text" name="query" placeholder="Ask a question!" value={input} onChange={inputChange} />

                <button className={buttonLocked + 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'} disabled={handling} type="submit">Send</button>
            </form>
            <div>
                {historyList}
            </div>
        </>
    );
}

export default App;
