window.addEventListener('load', init);

let form;
let response;
function init() {
    form = document.getElementById('form');
    form.addEventListener('submit', formSubmitHandler);

    response = document.getElementById('response');
}

async function formSubmitHandler(e) {
    e.preventDefault();
    console.log(e.target[0].value)
    await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: e.target[0].value
        })
    })
        .then((response) => response.json())
        .then((data) => dataIsLoaded(data))
        .catch((error) => console.log('data couldnt load: ' + error))
}

function dataIsLoaded(data) {
    let p = document.createElement('p');
    p.innerHTML = data.kwargs.content
    response.appendChild(p)
    console.log(data)
}

