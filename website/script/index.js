const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const imageUpload = document.getElementById('imageUpload');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const themeToggle = document.getElementById('themeToggle');

let currentImage = null;

// Theme toggle
themeToggle.addEventListener('click', () => {
    const theme = document.getElementById('theme');
    const isDark = theme.getAttribute('href').includes('dark.css');
    
    if (isDark) {
        theme.setAttribute('href', 'website/styles/light.css');
        themeToggle.textContent = '☀️';
    } else {
        theme.setAttribute('href', 'website/styles/dark.css');
        themeToggle.textContent = '🌙';
    }
});

// Image paste support
document.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
            const blob = item.getAsFile();
            handleImage(blob);
            break;
        }
    }
});

// Image upload button
imageUpload.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleImage(e.target.files[0]);
    }
});

function handleImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        ai.setImage(currentImage);
        
        imagePreview.innerHTML = `<img src="${currentImage}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
}

// Send message
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message && !currentImage) return;

    // Clear input
    userInput.value = '';
    userInput.rows = 1;

    // Add user message to chat
    addMessage(message, 'user', currentImage);
    
    // Show thinking indicator
    const thinkingDiv = addThinkingIndicator();

    // Detect mode
    const mode = ai.detectMode(message);
    
    // Send to AI
    const result = await ai.sendMessage(message, currentImage, mode);

    // Remove thinking indicator
    thinkingDiv.remove();

    // Add AI response
    if (result.success) {
        addMessage(result.response, 'ai', null, mode);
    } else {
        addMessage(`Error: ${result.error}`, 'ai');
    }

    // Clear image
    currentImage = null;
    ai.clearImage();
    imagePreview.innerHTML = '';
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Auto-resize textarea
userInput.addEventListener('input', () => {
    userInput.rows = Math.min(Math.ceil(userInput.scrollHeight / 24), 10);
});

function addMessage(content, sender, image = null, mode = null) {
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;

    let html = '';
    
    if (mode && mode !== 'chat') {
        html += `<div class="mode-indicator">[${mode.toUpperCase()} MODE]</div>`;
    }

    if (image) {
        html += `<img src="${image}" alt="User image"><br>`;
    }

    html += `<div>${escapeHtml(content)}</div>`;
    
    div.innerHTML = html;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addThinkingIndicator() {
    const div = document.createElement('div');
    div.className = 'thinking';
    div.innerHTML = '<span></span><span></span><span></span>';
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return div;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize
console.log('Generive AI initialized 🚀');