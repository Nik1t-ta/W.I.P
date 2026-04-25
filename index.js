const app = document.getElementById('app-container');
const statusBox = document.getElementById('status-msg');
let selectedProvider = null;
const getSavedAccount = () => JSON.parse(localStorage.getItem('bit_user'));
function showMessage(text, color = "#ff4b2b") {
    statusBox.innerText = text;
    statusBox.style.background = color;
    statusBox.className = "status-visible";
    setTimeout(() => { statusBox.className = "status-hidden"; }, 3000);
}
function triggerTransition(newState) {
    app.classList.remove('slide-in');
    app.classList.add('slide-out');
    setTimeout(() => {
        render(newState);
        app.classList.remove('slide-out');
        app.classList.add('slide-in');
    }, 8000);
}
function render(state) {
    const account = getSavedAccount(); 
    if (state === 'start') {
        app.innerHTML = `
            <div class="welcome-content">
                <p class="pre-header">Sign up to continue!</p>
                <h1>Bit says Hi!</h1>
                <div class="auth-wrapper">
                    <button class="main-btn">Sign Up with...</button>
                    <div class="split-options">
                        <button class="auth-btn google" onclick="handleAuth('Google')">Google</button>
                        <button class="auth-btn github" onclick="handleAuth('GitHub')">GitHub</button>
                    </div>
                </div>
            </div>`;
    } else if (state === 'onboarding') {
        app.innerHTML = `
            <div class="welcome-content">
                <h1>Make an account!</h1>
                <p class="pre-header">Bit wants to know about you!</p>
                <input type="text" id="reg-user" placeholder="Username">
                <input type="password" id="reg-pass" placeholder="Account Password (2FA)">
                <input type="password" id="reg-vpass" placeholder="Verify Password">
                <input type="date" id="reg-dob" title="Birthday (Not optional)">
                <button class="main-btn" onclick="completeSignup()">Apply</button>
            </div>`;
    } else if (state === 'login') {
        const other = account.provider === 'Google' ? 'GitHub' : 'Google';
        app.innerHTML = `
            <div class="welcome-content">
                <h1>Looks like you are already in!</h1>
                <p>Login via ${account.provider}</p>
                <input type="password" id="login-2fa" placeholder="Account Password">
                <button class="main-btn" onclick="verify2FA()">Enter</button>
                <br>
                <a href="#" onclick="triggerTransition('start')">Try with ${other} instead</a>
            </div>`;
    }
}
function handleAuth(provider) {
    selectedProvider = provider;
    triggerTransition('onboarding');
}
function completeSignup() {
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;
    const vPass = document.getElementById('reg-vpass').value;
    if (!user || !pass) return showMessage("Some fields are not filled up.");
    if (pass !== vPass) return showMessage("Passwords don't match.");
    localStorage.setItem('bit_user', JSON.stringify({
        username: user, password: pass, provider: selectedProvider
    }));
    showMessage("Created!", "#3ca381");
    triggerTransition('login');
}
function verify2FA() {
    const input = document.getElementById('login-2fa').value;
    const account = getSavedAccount();
    if (input === account.password) {
        showMessage("That works!", "#3ca381");
        app.classList.add('slide-out');
    } else {
        showMessage("Wrong Password!");
    }
}
window.onload = () => {
    const account = getSavedAccount();
    render(account ? 'login' : 'start');
    app.classList.add('slide-in');
};