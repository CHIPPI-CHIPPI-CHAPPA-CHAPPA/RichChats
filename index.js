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

const database = firebase.database();
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message');
const statusInput = document.getElementById('status');
const usernameInput = document.getElementById('username');
const nameContainer = document.getElementById('name-container');
const chatContainer = document.getElementById('chat-container');

function startChatting() {
    const username = usernameInput.value;
    if (username.trim() !== "") {
        nameContainer.style.display = 'none';
        chatContainer.style.display = 'block';
        initializeChat();
    } else {
        alert("Please Enter a valid name");
    }
}

function sendMessage() {
    const message = messageInput.value;
    const status = statusInput.value || "Unknown";

    if (message) {
        const username = usernameInput.value || "Anonymous";
        database.ref('messages').push({
            username: username,
            message: message,
            status: status
        });

        messageInput.value = '';
    }
}

function appendMessage(username, message, status) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${username} (${status}):</strong> ${message}`;
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function initializeChat() {
    console.log("Initializing chat...");
    database.ref('messages').on('child_added', snapshot => {
        console.log("New message received:", snapshot.val());
        const message = snapshot.val();
        appendMessage(message.username, message.message, message.status);
    });
}

function clearMessages() {
    chatMessages.innerHTML = '';
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


