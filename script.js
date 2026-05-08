let zIndex = 1;

function openApp(appName) {
  const appsDiv = document.getElementById('apps');
  const appWindow = document.createElement('div');
  appWindow.classList.add('app-window');
  appWindow.style.zIndex = zIndex++;

  // App content
  if (appName === 'internet') {
    appWindow.innerHTML = `
      <div class="titlebar">
        Internet Explorer
        <button onclick="closeApp(this)">X</button>
      </div>
      <p style="padding:10px;">Browser window content...</p>
    `;
  } else if (appName === 'file') {
    appWindow.innerHTML = `
      <div class="titlebar">
        File Manager
        <button onclick="closeApp(this)">X</button>
      </div>
      <p style="padding:10px;">File manager content...</p>
    `;
  }

  makeDraggable(appWindow);
  appsDiv.appendChild(appWindow);
}

function closeApp(button) {
  button.closest('.app-window').remove();
}

function makeDraggable(el) {
  const titleBar = el.querySelector('.titlebar');
  let offsetX, offsetY;

  titleBar.onmousedown = (e) => {
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;

    // Bring to front
    el.style.zIndex = zIndex++;

    document.onmousemove = (e) => {
      el.style.left = e.clientX - offsetX + 'px';
      el.style.top = e.clientY - offsetY + 'px';
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}