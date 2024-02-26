const firebaseConfig = {
    apiKey: "AIzaSyApX6CkTuolDhzKSGshW7nDA_qRJBwfnEs",
    authDomain: "richchats-295f0.firebaseapp.com",
    databaseURL: "https://richchats-295f0-default-rtdb.firebaseio.com",
    projectId: "richchats-295f0",
    storageBucket: "richchats-295f0.appspot.com",
    messagingSenderId: "221024421022",
    appId: "1:221024421022:web:f8835154e5fbcacfa5e78f"
};

firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const database = firebase.database();
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message');
const statusInput = document.getElementById('status');
const usernameInput = document.getElementById('username');
const nameContainer = document.getElementById('name-container');
const chatContainer = document.getElementById('chat-container');

function sendMessage() {
    const message = messageInput.value;
    const status = statusInput.value || "Unknown";

    if (message) {
        const user = auth.currentUser;
        const userId = user.uid;
        const userName = user.displayName;

        database.ref('messages').push({
            userId: userId,
            username: userName,
            message: message,
            status: status
        });

        messageInput.value = '';
    }
}

messageInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

document.getElementById('Send').addEventListener('click', function () {
    sendMessage();
});

function appendMessage(userId, username, message, status) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${username} (${status}):</strong> ${message}`;
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const userItem = document.getElementById(userId);
    if (userItem) {
        database.ref('presence/' + userId).once('value').then((snapshot) => {
            const isOnline = snapshot.val();
            userItem.style.color = isOnline ? 'green' : 'red';
        });
    }
}


function initializeChat() {
    console.log("Initializing chat...");

    auth.onAuthStateChanged((user) => {
        if (user) {
            const userId = user.uid;
            const userName = user.displayName;

            addUserToList(userId, user);

            database.ref('messages').on('child_added', snapshot => {
                const message = snapshot.val();
                appendMessage(message.userId, message.username, message.message, message.status);
            });

            database.ref('presence/' + userId).set(true);
            database.ref('presence/' + userId).onDisconnect().remove();
        } else {
            console.log("User signed out");
        }
    });
}
function appendMessage(userId, username, message, status) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${username} (${status}):</strong> ${message}`;
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function clearMessages() {
    chatMessages.innerHTML = " Sucess! ";
    setTimeout(()=> {
        chatMessages.innerHTML = "  ";
     }
     ,1000);
}

function toggleMode() {
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('.container').forEach(container => {
        container.classList.toggle('dark-mode');
    });
    document.getElementById('toggle-mode').classList.toggle('dark-mode');

}

usernameInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        startChatting();
    }
});

messageInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});


function signup() {
    const signupUsername = document.getElementById('signup-username').value;
    const signupEmail = document.getElementById('signup-email').value;
    const signupPassword = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(signupEmail, signupPassword)
        .then((userCredential) => {
            const user = userCredential.user;
            user.updateProfile({
                displayName: signupUsername
            }).then(() => {
                console.log("Signup successful:", user);
                switchContainer('login-container');
            }).catch((error) => {
                alert("Error updating username: " + error.message);
            });

            addUserToList(user.uid, user, "Unknown");
        })
        .catch((error) => {
            alert("Signup failed. " + error.message);
        });
}



function login() {
    const loginEmail = document.getElementById('login-email').value;
    const loginPassword = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(loginEmail, loginPassword)
        .then((userCredential) => {
            console.log("Login successful:", userCredential.user);
            switchContainer('chat-container');
            initializeChat();
        })
        .catch((error) => {
            alert("Login failed. " + error.message);
        });
}

function switchContainer(containerId) {
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'none';

    document.getElementById(containerId).style.display = 'block';
}

function addUserToList(userId, user, status) {
    const userList = document.getElementById('user-list');
    const userItem = document.createElement('li');

    const username = user.displayName
    userItem.textContent = `${username} (${status})`;
    userItem.id = userId;

    userList.appendChild(userItem);
}

