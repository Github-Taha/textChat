const usernameEl = document.getElementById('username');
const passwordEl = document.getElementById('password');
const confirmPasswordEl = document.getElementById('cpassword');
const emailEl = document.getElementById('email');
const statusEl = document.getElementById('status');

function signup() {
    if (usernameEl.value.length < 3) {
        statusEl.innerText = 'Username must be at least 3 characters long';
        return;
    }
    else if (passwordEl.value.length < 3) {
        statusEl.innerText = 'Password must be at least 3 characters long';
        return;
    }
    else if (passwordEl.value!= confirmPasswordEl.value) {
        statusEl.innerText = 'Passwords do not match';
        return;
    }
    else if (emailEl.value.length == 0) {
        statusEl.innerText = 'You must enter an email';
        return;
    }
    let checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!checkEmail.test(emailEl.value)) {
        statusEl.innerText = 'You must enter a valid email';
        return;
    }

    let usernames = [];
    let emails = [];
    getData()
        .then((data) => {
            usernames = JSON.parse(data).map((user) => {
                return user.user;
            });
            emails = JSON.parse(data).map((user) => {
                return user.email;
            });

            if (usernames.includes(usernameEl.value)) {
                statusEl.innerText = 'Username already exists';
                return;
            }
            if (emails.includes(emailEl.value)) {
                statusEl.innerText = 'Email already exists';
                return;
            }

            makeUser();
        })
        .catch((err) => {
            console.log(err);
        });

    statusEl.innerText = '';
}

function getData() {
    return new Promise((resolve, reject) => {
        let xhttp;
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        } else {
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    resolve(xhttp.responseText);
                } else {
                    reject(xhttp.statusText);
                }
            }
        };

        xhttp.open("GET", "../data/users.json", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
    });
}

function makeUser() {
    sha256(passwordEl.value)
        .then((hash) => {
            let user = {
                type: 'signup',
                user: usernameEl.value,
                email: emailEl.value,
                password: hash
            };

            let data = JSON.stringify(user);

            let xhttp;
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest();
            } else {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        statusEl.innerText = 'User created';
                        window.setTimeout(() => {
                            window.location.href = '../loginSite/index.html';
                        }, 500)
                    } else {
                        statusEl.innerText = 'Error creating user. Try Again';
                    }
                }
            };
            xhttp.open("POST", "../data/users.json", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(data);
        })
        .catch((err) => {
            console.log(err);
        });
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

