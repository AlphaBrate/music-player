var songQueue = getSongQueue();

function getSongInfoTitArt(filepath) {
    var url = 'http://localhost:2367/songInfoSrt?filepath=' + filepath;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    // console.log(xhr.responseText);
    return xhr.responseText;
}

var songInfoList = [];
songQueue.forEach(function (filepath) {
    var tags = getSongInfoTitArt(filepath);
    songInfoList.push(tags);
});
SongList = [];
songInfoList.forEach(function (songInfo) {
    SongList.push(songInfo);
});
// Change song list
var SNN = 1;
// Create <a> tag: <a href="${}">${Title - Artist}</a> for each song
SongList.forEach(function (song) {
    // Filepath
    var filepath = songQueue[SNN - 1];
    var songList = document.getElementById('list');
    var a = document.createElement('a');
    a.href = `player.html?filepath=${filepath}&songNumber=${SNN}&queue=${songQueue}`;
    a.innerHTML = `${SNN}. ${song}`;
    songList.appendChild(a);
    SNN++;
});

// Song title clicked
var title = document.getElementById('title');
title.addEventListener('click', function () {
    // Expand song list
    var songList = document.getElementById('list');
    if (songList.style.height == '0px'||songList.style.height == '') {
        songList.style.height = 50 * SongList.length + 'px';
        songList.style.paddingTop = '30px';
        songList.style.paddingBottom = '30px';
        document.querySelector('.up').style.color = 'rgba(255, 255, 255, 0)';
    } else {
        songList.style.height = '0px';
        songList.style.paddingTop = '0px';
        songList.style.paddingBottom = '0px';
        document.querySelector('.up').style.color = 'rgba(255, 255, 255, 1)';
    }
});

// Add add button
