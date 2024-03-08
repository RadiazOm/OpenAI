import { useEffect, useState } from 'react';
import './App.css';
import History from './components/History.jsx';

function App() {
    const [history, setHistory] = useState([]);
    const [handling, setHandling] = useState(false);
    const [buttonLocked, setButtonLocked] = useState('');
    const [response, setResponse] = useState('');
    const [input, setInput] = useState('');

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
        console.log('saved history')
        localStorage.setItem('history', JSON.stringify(history));
    }, [history]);

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

    const dataIsLoaded = (data) => {
        setResponse(data.kwargs.content);
        saveHistory(['ai', data.kwargs.content]);
    };

    const historyList = history.map((message, index) => (
        <History key={index} message={message[1]} />
    ));

    return (
        <>
            <form method="post" onSubmit={handleRequest}>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="query">Ask me a question!</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="query" type="text" name="query" placeholder="Ask a question!" value={input} onChange={inputChange} />

                <button className={buttonLocked} disabled={handling} type="submit">Send</button>
            </form>
            <div>
                {historyList}
            </div>
        </>
    );
}

export default App;
