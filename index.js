// (C) AlphaBrate 2023, All rights reserved.
// This projet is to create a music player with electron
//
// Libarys
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');
const { dialog } = require('electron');
const fs = require('fs');
const { exec } = require('child_process');
const { shell } = require('electron');
const { Menu } = require('electron');
const { globalShortcut } = require('electron');
const { Notification } = require('electron');
const { Tray } = require('electron');
const { nativeImage } = require('electron');
const { clipboard } = require('electron');
const { powerMonitor } = require('electron');
const { screen } = require('electron');
const { session } = require('electron');
const { powerSaveBlocker } = require('electron');
const { net } = require('electron');
const { netLog } = require('electron');
const { protocol } = require('electron');
const { BrowserView } = require('electron');
const { webContents } = require('electron');
const { v8 } = require('electron');
const express = require('express');
const app2 = express();
const port = 2367;
const NodeID3 = require('node-id3');
const bodyParser = require('body-parser');
const https = require('https');

app2.use(bodyParser.json({ limit: '50mb' }));
app2.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Music Metadata Tags generator

// itunes search api: https://itunes.apple.com/search?term={}&limit=25
// Return: 1.txt (JSON)

// Express start server
app2.get('/songInfo', (req, res) => {
    var filepath = req.query.filepath;
    var songInfo = NodeID3.read(filepath);
    res.send(songInfo);
});

app2.get('/songInfoSrt', (req, res) => {
    var filepath = req.query.filepath;
    try {
        var songInfo = NodeID3.read(filepath);
    } catch {
        res.send('Unknown Song');
    }
    res.send(`${songInfo.title} - ${songInfo.artist}`);
});

app2.get('/winNotify', (req, res) => {
    var title = req.query.title;
    var body = req.query.body;
    var icon = req.query.icon;
    var notification = new Notification({
        title: title,
        body: body,
        icon: icon,

    });
    notification.show();
    res.send('Done');
});

app2.post('/toggleFullscreen', (req, res) => {
    // toggle fullscreen
    var win = BrowserWindow.getFocusedWindow();
    if (win.isFullScreen()) {
        win.setFullScreen(false);
    }
    else {
        win.setFullScreen(true);
    }
    res.send('Done');
});

app2.post('/fullscreen/:tf', (req, res) => {
    // Set fullscreen to true or false
    var tf = req.params.tf;
    var win = BrowserWindow.getFocusedWindow();
    if (tf == 'true') {
        win.setFullScreen(true);
    }
    else {
        win.setFullScreen(false);
    }
    res.send('Done');
});

app2.get('/winPageDownloadTags/:file.:ext', (req, res) => {
    res.sendFile(__dirname + `/app/${req.params.file}.${req.params.ext}`);
});

app2.get('/assets/:file.:ext', (req, res) => {
    res.sendFile(__dirname + `/assets/${req.params.file}.${req.params.ext}`);
});

app2.get('/assets/:folder/:file.:ext', (req, res) => {
    res.sendFile(__dirname + `/assets/${req.params.folder}/${req.params.file}.${req.params.ext}`);
});

app2.get('/assets/:folder1/:folder2/:file.:ext', (req, res) => {
    res.sendFile(__dirname + `/assets/${req.params.folder1}/${req.params.folder2}/${req.params.file}.${req.params.ext}`);
});

app2.get('/assets/:folder1/:folder2/:folder3/:file.:ext', (req, res) => {
    res.sendFile(__dirname + `/assets/${req.params.folder1}/${req.params.folder2}/${req.params.folder3}/${req.params.file}.${req.params.ext}`);
});

app2.post('/downloadMp3WithTags', (req, res) => {
    var data = req.body;
    fs.writeFile('app/json/cache.json', JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log("Cache saved!");
        fs.readFile('app/json/cache.json', 'utf8', function (err, data) {
            if (err) throw err;
            var json = JSON.parse(data);

            // base64 to file image
            json.artwork = json.artwork.replace(/^data:image\/png;base64,/, '');
            var buffer = Buffer.from(json.artwork, 'base64');
            var image = {
                mime: 'image/png',
                type: { id: 3, name: 'front cover' },
                description: '',
                imageBuffer: buffer
            }
            var tags = {
                title: json.title,
                artist: json.artist,
                album: json.album,
                year: json.year,
                image: image
            }
            var audio = Buffer.from(json.audio, 'base64');
            fs.writeFile(`app/json/cache.mp3`, audio, function (err) {
                if (err) throw err;
                console.log("Audio saved!");
                NodeID3.write(tags, `app/json/cache.mp3`);
                res.send(`http://localhost:2367/app/json/cache.mp3`);
            });
        });
    });
});

app2.get('/app/json/cache.mp3', (req, res) => {
    res.sendFile(__dirname + `/app/json/cache.mp3`);
});

var win;

// Create the window with homepage index.html
function createWindow(w, h) {
    win = new BrowserWindow({
        width: w,
        height: h,
        icon: 'assets/icons/png/64x64.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        fullscreenable: true,
    });

    // Load the index.html of the app.
    win.loadFile('app/index.html');
    // Open the DevTools.
    // win.webContents.openDevTools()
    // Allow electron to read the file system
    win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        return callback(true);
    });


}

// Get history width and height from file
function startup() {
    // Clear /app/json/ folder
    fs.readdir('app/json/', (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join('app/json/', file), err => {
                if (err) throw err;
            });
        }
        // Clear cache
        fs.writeFile('app/json/cache.json', '{}', function (err) {
            if (err) throw err;
            console.log("Cache cleared!");
        });
    });
    createWindow(800,600);
}

// When the app is ready
app.whenReady().then(() => {
    startup();
    // Create a tray icon
    const tray = new Tray('assets/icons/png/64x64.png');
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: function () { createWindow(); } },
        { label: 'Quit', click: function () { app.quit(); } },
    ]);
    tray.setToolTip('AlphaBrate Music Player');
    tray.setContextMenu(contextMenu);
    // Disable the default menu
    Menu.setApplicationMenu(null);
    tray.on('click', function () {
        createWindow();
    });
});

try {
    app2.listen(port);
} catch {}