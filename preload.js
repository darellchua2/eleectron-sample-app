const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getBackendStatus: () => ipcRenderer.invoke('get-backend-status'),

  // Add any other IPC methods your calculator app might need
  onBackendReady: (callback) => ipcRenderer.on('backend-ready', callback),
  removeBackendReadyListener: (callback) => ipcRenderer.removeListener('backend-ready', callback)
});