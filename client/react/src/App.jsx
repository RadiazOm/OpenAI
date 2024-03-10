import {useCallback, useEffect, useState} from 'react';
import './App.css';
import History from './components/History.jsx';

function App() {
    const [history, setHistory] = useState([]);
    const [handling, setHandling] = useState(false);
    const [buttonLocked, setButtonLocked] = useState('');
    const [partResponse, setPartResponse] = useState('');
    const [input, setInput] = useState('');
    const [buttonIcon, setButtonIcon] = useState(<svg className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
    </svg>);
    const [voiceToggle, setVoiceToggle] = useState(true)
    const [, updateState] = useState();

    let synth = window.speechSynthesis
    let voices = window.speechSynthesis.getVoices()

    // Fetch initial history from localStorage
    useEffect(() => {
        // historyList = history.map((message, index) => (
        //     <History key={index} message={message[1]} />
        // ));
        const savedHistory = JSON.parse(localStorage.getItem('history')) || [];
        setHistory(savedHistory);
    }, []);

    useEffect(() => {
        // Save history to localStorage whenever it changes
        if (history.length === 0) {
            return;
        }
        if (history[history.length - 1][0] !== 'human') {
            return;
        }
        fetchStream()
    }, [history]);

    const forceUpdate = useCallback(() => updateState({}), []);

    const setLocalStorage = (history) => {
        console.log(history)
        console.log(JSON.stringify(history))
        localStorage.setItem('history', JSON.stringify(history));
    }

    const speak = (text) => {
        if (synth.speaking || !voiceToggle) {
            return
        }
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

    const fetchStream = () => {
        try {
            fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: input,
                    history: history
                })
            }).then(async (response) => {
                // response.body is a ReadableStream
                const reader = response.body.getReader();
                let index = 1
                for await (const chunk of readChunks(reader)) {
                    const string = new TextDecoder().decode(chunk);
                    saveChunkedHistory(string, index);
                    index++
                }
                console.log(history)
                speak(history[history.length - 1][1])
                setLocalStorage(history)
            })
        } catch (error) {
            console.log('data could not load: ' + error);
        } finally {
            setHandling(false);
            setButtonLocked('');
        }
    }

    const handleRequest = async (event) => {
        event.preventDefault();
        if (handling) return;

        setHandling(true);
        setButtonLocked('opacity-50 cursor-not-allowed');
        saveHistory(['human', input]);
    };

    const saveChunkedHistory = (chunk, index) => {
        let historyChanged = history
        if (index === 1) {
            console.log('first chunk')
            historyChanged.push(['ai', chunk])
            setHistory(historyChanged)
        } else {
            console.log('other chunk: ' + index)
            historyChanged[history.length - 1][1] += chunk
            console.log(historyChanged[history.length - 1][1])
            setHistory(historyChanged)
        }
        forceUpdate()
    }

    const deleteHistory = () => {
        setHistory([])
        localStorage.setItem('history', JSON.stringify([]));
    }

    const toggleVoice = () => {
        console.log('before ' + voiceToggle)

        setVoiceToggle(!voiceToggle)
        if (voiceToggle) {
            setButtonIcon(<svg className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
            </svg>);
        } else {
            setButtonIcon(<svg className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
            </svg>);
        }
        console.log('after ' + voiceToggle)
    }

    // const dataIsLoaded = (data) => {
    //     saveHistory(['ai', data]);
    //     speak(data)
    // };

    const historyList = history.map((message, index) => (
        <History key={index} message={message[1]} messenger={message[0]} />
    ));

    function readChunks(reader) {
        return {
            async* [Symbol.asyncIterator]() {
                let readResult = await reader.read();
                while (!readResult.done) {
                    yield readResult.value;
                    readResult = await reader.read();
                }
            },
        };
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
                <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
                        <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
                            {historyList}
                        </div>
                    </div>
                    <div className="bg-gray-300 p-4">
                        {/*<button onClick={toggleVoice} className={buttonColour + ' text-white font-bold py-2 px-4 rounded'}>Toggle voice</button>*/}
                        {/*<button onClick={deleteHistory} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>delete history</button>*/}
                        <form className="w-full" method="post" onSubmit={handleRequest}>
                            {/*<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="query">Ask me a question!</label>*/}
                            <div className="flex">
                                <input className="flex items-center h-10 w-full rounded px-3 text-sm" id="query" type="text" name="query" placeholder="Ask a question!" value={input} onChange={inputChange} />

                                <button className={buttonLocked + 'rounded px-3 text-sm'} disabled={handling} type="submit"><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
                                    <path d="M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z"/>
                                </svg></button>
                            </div>
                        </form>
                        <div className="flex justify-between">
                            <button onClick={toggleVoice} className="m-2">{buttonIcon}</button>
                            <button onClick={deleteHistory}>
                                <svg className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
