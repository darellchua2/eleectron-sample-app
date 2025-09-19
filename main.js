const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const kill = require("tree-kill");
const waitOn = require("wait-on");

let mainWindow;
let backendProcess;
let frontendProcess;
const isDev = process.argv.includes("--dev");
const processes = [];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
  });

  // Load frontend once it’s ready
  const frontendUrl = "http://localhost:3000";
  waitOn({ resources: [frontendUrl], timeout: 30000 })
    .then(() => {
      mainWindow.loadURL(frontendUrl);
      if (isDev) {
        mainWindow.webContents.openDevTools();
      }
    })
    .catch((err) => {
      console.error("Frontend failed to start:", err.message);
    });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function startBackend() {
  let backendPath;
  let venvPath;
  let pythonExecutable;
  let spawnArgs;

  if (isDev) {
    backendPath = path.join(__dirname, "backend");
    venvPath = path.join(backendPath, "myvenv");

    // Use Poetry in development
    const venvActivate = path.join(venvPath, "bin", "activate");
    const command = `source ${venvActivate} && poetry run python3 main.py`;
    pythonExecutable = "bash";
    spawnArgs = ["-c", command];
  } else {
    const userDataPath = app.getPath("userData");
    const writableBackendPath = path.join(userDataPath, "backend");
    const writableLogsPath = path.join(userDataPath, "logs");
    const writableTmpPath = path.join(userDataPath, "tmp");

    // Create all necessary writable directories
    [writableBackendPath, writableLogsPath, writableTmpPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Copy SQLite template DB if needed
    const templateDb = path.join(
      process.resourcesPath,
      "sqlite-template",
      "calculator.db"
    );
    const targetDb = path.join(writableBackendPath, "calculator.db");
    if (fs.existsSync(templateDb) && !fs.existsSync(targetDb)) {
      fs.copyFileSync(templateDb, targetDb);
    }

    // Copy backend files
    const sourceBackendPath = path.join(__dirname, "backend");
    [
      "main.py",
      "routes.py",
      "models.py",
      "database.py",
      "pyproject.toml",
    ].forEach((file) => {
      const src = path.join(sourceBackendPath, file);
      const dest = path.join(writableBackendPath, file);
      if (fs.existsSync(src) && !fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
      }
    });

    backendPath = writableBackendPath;
    venvPath = path.join(
      process.resourcesPath,
      "app.asar.unpacked",
      "backend",
      "prod-venv"
    );

    const possiblePythonPaths = [
      path.join(venvPath, "bin", "python3"),
      path.join(venvPath, "bin", "python"),
      path.join(venvPath, "Scripts", "python.exe"),
      "python3",
      "python",
    ];

    pythonExecutable =
      possiblePythonPaths.find(
        (p) => fs.existsSync(p) || !path.isAbsolute(p)
      ) || "python3";
    spawnArgs = ["main.py"];

    // Set environment variables for writable paths
    process.env.DATABASE_PATH = targetDb;
    process.env.LOGS_PATH = writableLogsPath;
    process.env.TMPDIR = writableTmpPath;
    process.env.TMP = writableTmpPath;
    process.env.TEMP = writableTmpPath;
  }

  console.log(
    `Starting backend with: ${pythonExecutable} ${spawnArgs.join(" ")}`
  );

  backendProcess = spawn(pythonExecutable, spawnArgs, {
    cwd: backendPath,
    stdio: isDev ? "inherit" : "pipe",
    env: { ...process.env },
  });

  processes.push(backendProcess.pid);

  backendProcess.on("error", (err) => {
    console.error("Backend error:", err.message);
  });

  backendProcess.on("exit", (code, signal) => {
    console.log(`Backend exited with code ${code}, signal ${signal}`);
  });

  if (!isDev) {
    backendProcess.stdout.on("data", (data) =>
      console.log("Backend:", data.toString())
    );
    backendProcess.stderr.on("data", (data) =>
      console.error("Backend error:", data.toString())
    );
  }

  // ✅ Wait until backend port is ready (default 8000)
  waitOn({ resources: ["tcp:127.0.0.1:8000"], timeout: 20000 })
    .then(() => console.log("Backend is ready on port 8000"))
    .catch((err) => console.error("Backend failed to start:", err.message));
}

function startFrontend() {
  if (!isDev) return;

  const frontendPath = path.join(__dirname, "frontend");
  frontendProcess = spawn("npm", ["run", "dev"], {
    cwd: frontendPath,
    stdio: "inherit",
  });

  processes.push(frontendProcess.pid);

  frontendProcess.on("error", (err) => {
    console.error("Frontend error:", err.message);
  });

  frontendProcess.on("exit", (code) => {
    console.log(`Frontend exited with code ${code}`);
  });
}

function startStandaloneFrontend() {
  if (isDev) return;

  const standalonePath = app.isPackaged
    ? path.join(
        process.resourcesPath,
        "app.asar.unpacked",
        "frontend",
        ".next",
        "standalone"
      )
    : path.join(__dirname, "frontend", ".next", "standalone");

  const serverPath = path.join(standalonePath, "server.js");
  if (!fs.existsSync(serverPath)) {
    console.error("Standalone server.js not found");
    return;
  }

  // Create writable directories in user data path
  const userDataPath = app.getPath("userData");
  const writableFrontendPath = path.join(userDataPath, "frontend");
  const writableCachePath = path.join(writableFrontendPath, ".next", "cache");
  const writableTmpPath = path.join(userDataPath, "tmp");

  // Ensure writable directories exist
  [writableFrontendPath, writableCachePath, writableTmpPath].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  frontendProcess = spawn("node", [serverPath], {
    cwd: standalonePath,
    stdio: "pipe",
    env: {
      ...process.env,
      PORT: "3000",
      HOSTNAME: "localhost",
      NEXT_CACHE: writableCachePath,
      TMPDIR: writableTmpPath,
      TMP: writableTmpPath,
      TEMP: writableTmpPath
    },
  });

  processes.push(frontendProcess.pid);

  frontendProcess.on("error", (err) => {
    console.error("Standalone frontend error:", err.message);
  });

  frontendProcess.on("exit", (code) => {
    console.log(`Standalone frontend exited with code ${code}`);
  });

  frontendProcess.stdout.on("data", (data) =>
    console.log("Frontend:", data.toString())
  );
  frontendProcess.stderr.on("data", (data) =>
    console.error("Frontend error:", data.toString())
  );
}

function cleanup() {
  processes.forEach((pid) => {
    try {
      kill(pid, "SIGTERM");
    } catch (err) {
      console.error("Failed to kill process:", err.message);
    }
  });
}

app.whenReady().then(() => {
  startBackend();
  isDev ? startFrontend() : startStandaloneFrontend();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  cleanup();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", cleanup);

ipcMain.handle("get-backend-status", () => {
  return { status: "running", port: 8000 };
});
