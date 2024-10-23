const usernameEl = document.getElementById('username');
const passwordEl = document.getElementById('password');
const statusEl = document.getElementById('status');

function login() {
    if (usernameEl.value == '' || passwordEl.value == '') {
        alert('Please fill in all fields!');
    }
    else {
        const xhttp = new XMLHttpRequest();
        xhttp.open('POST', '/loginSite', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        sha256(passwordEl.value)
            .then(
                (hashed) => {
                    xhttp.send(
                        JSON.stringify(
                            {
                                type: 'login',
                                user: usernameEl.value,
                                password: hashed
                            }
                        )
                    ); 
                }
            )
            .catch(
                (error) => {
                    console.log(error);
                }
            );
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {
                    statusEl.innerText = 'Login success';
                    sessionStorage.setItem('username', 'loggedIn');
                    sessionStorage.setItem('user', usernameEl.value);
                    window.setTimeout(() => {
                        window.location.href = '../textingSite/index.html';
                    }, 500);
                }
                else if (xhttp.status == 202) {
                    statusEl.innerText = 'Login failed. Wrong Password or Username';
                }
            }
            else {
                statusEl.innerText = 'Coudn\'t connect to server';
            }
        };
    }
}

async function sha256(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
}
