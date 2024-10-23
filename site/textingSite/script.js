window.onload = () => {
    if (sessionStorage.getItem('username') != 'loggedIn') {
        window.location.href = '../frontPage/index.html';
    }
}

const messageEl = document.getElementById('message');
const messageListEl = document.getElementById('message-list');

function sendButton() {
    let xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("POST", "#", true);

    let username = sessionStorage.getItem('user');
    
    if (messageEl.value == '') {
        alert('Please enter a message');
        return;
    }

    let data = {
        type: 'send',
        user: username,
        text: messageEl.value
    };

    messageEl.value = '';

    xhttp.send(JSON.stringify(data));
}

function getData() {
    let xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            outputData(xhttp.responseText);
        }
    };

    xhttp.open("GET", "../data/texts.json", true); // Set the third parameter to true for asynchronous request
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function outputData(data) {
    let dataObj = JSON.parse(data);
    let html = '';
    messageListEl.innerHTML = '';
    for (let i = 0; i < dataObj.length; i++) {
        html = '<h3>' + dataObj[i].user + ':'+ dataObj[i].time + '</h3>' + '<b><p>' + dataObj[i].text + '</p></b>';
        let message = document.createElement('div');
        message.classList.add('messages');
        message.innerHTML = html;
        messageListEl.appendChild(message);
    }
}

function clearMessages() {
    let xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("POST", "#", true);

    xhttp.send('["clear"]');
}

window.setInterval(getData, 500);
message.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        sendButton();
    }
});
window.onbeforeunload = () => {
    sessionStorage.setItem('username', 'loggedOut');
    return;
}