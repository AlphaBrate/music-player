// Get search query from url
function getQuery() {
    var url = window.location.href;
    var query = url.split('?');
    return query[1];
}
// Get search query json in format of {key: value}
function getQueryJson() {
    var query = getQuery();
    var queryJson = {};
    if (query) {
        var queryArray = query.split('&');
        for (var i = 0; i < queryArray.length; i++) {
            var keyValue = queryArray[i].split('=');
            queryJson[keyValue[0]] = keyValue[1];
        }
    }
    return queryJson;
}

// Get song queue from getQueryJson
function getSongQueue() {
    // Look
    var songQueue = getQueryJson().queue;
    if (songQueue) {
        songQueue = songQueue.split(',');
    } else {
        songQueue = [];
    }
    return songQueue;
}

// Check if filepath is in song queue, if not, add it to the front
function checkSongQueue(filepath) {
    var songQueue = getSongQueue();
    if (songQueue.indexOf(filepath) === -1) {
        songQueue.unshift(filepath);
    }
    return songQueue;
}
// Check if the song number exists in getQueryJson, if not, set it to 0
function checkSongNumber() {
    var songNumber = getQueryJson().songNumber;
    if (!songNumber) {
        songNumber = 0;
    }
    return songNumber;
}

// Set song src to #audio
function setSongSrc(filepath) {
    var audio = document.getElementById('audio');
    audio.src = filepath;
}
setSongSrc(getQueryJson().filepath);

// Get song info from /songInfo
function getSongInfo(filepath) {
    var url = 'http://localhost:2367/songInfo?filepath=' + filepath;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    var songInfo = JSON.parse(xhr.responseText);
    // console.log(songInfo);
    // Cache song info as a array
    var songInfoArray = [];
    songInfoArray.push(songInfo.title);
    songInfoArray.push(songInfo.artist);
    songInfoArray.push(songInfo.album);
    songInfoArray.push(songInfo.year);
    songInfoArray.push(songInfo.image.imageBuffer.data);
    // filepath
    songInfoArray.push(filepath);
    return songInfo;
}
var info = getSongInfo(getQueryJson().filepath);

// Change album art to data:image/png;base64
var albumArt = `data:image;base64,${Buffer.from(info.image.imageBuffer.data).toString('base64')}`;
var albumArtElement = document.getElementById('albumArt');
albumArtElement.src = albumArt;
document.body.style.backgroundImage = `url(${albumArt})`;
// Change song title
var songTitle = document.getElementById('title');
songTitle.innerHTML = info.title;
// Change artist
var artist = document.getElementById('artist');
artist.innerHTML = info.artist;
// Change album
var album = document.getElementById('album');
album.innerHTML = info.album;
// Change year
var year = document.getElementById('year');
year.innerHTML = info.year;
