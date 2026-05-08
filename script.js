function openApp(appName) {
  const appsDiv = document.getElementById('apps');
  let appWindow = document.createElement('div');
  appWindow.classList.add('app-window');
  
  if (appName === 'internet') {
    appWindow.innerHTML = '<h3>Internet Explorer</h3><p>Browser window content...</p>';
  } else if (appName === 'file') {
    appWindow.innerHTML = '<h3>File Manager</h3><p>File manager content...</p>';
  }
  
  appsDiv.appendChild(appWindow);
}