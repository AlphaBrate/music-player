// Play song
function playSong() {
    var audio = document.getElementById('audio');
    audio.play();
    // Change button#toggle 's data-playing to true
    var toggle = document.getElementById('toggle');
    toggle.setAttribute('data-playing', 'true');
    // Change button#toggle 's innerHTML to 'pause.svg'
    var toggleIcon = document.getElementById('toggleIcon');
    toggleIcon.src = '../assets/icons/svg/pause.svg';
}
playSong();

var toggleIcons = ['../assets/icons/svg/play.svg', '../assets/icons/svg/pause.svg']

// On click button#toggle
function toggleSong() {
    var audio = document.getElementById('audio');
    var toggle = document.getElementById('toggle');
    var toggleIcon = document.getElementById('toggleIcon');
    if (toggle.getAttribute('data-playing') === 'true') {
        audio.pause();
        toggle.setAttribute('data-playing', 'false');
        toggleIcon.src = toggleIcons[0];
    } else {
        audio.play();
        toggle.setAttribute('data-playing', 'true');
        toggleIcon.src = toggleIcons[1];
    }
    setTimeCursor();
}
document.getElementById('toggle').addEventListener('click', toggleSong);

// Check if song is playing every 100ms
function checkPlaying() {
    var audio = document.getElementById('audio');
    var toggle = document.getElementById('toggle');
    var toggleIcon = document.getElementById('toggleIcon');
    if (audio.paused) {
        toggle.setAttribute('data-playing', 'false');
        toggleIcon.src = toggleIcons[0];
        // Check if song is ended
        if (audio.currentTime === audio.duration) {
            audio.currentTime = 0;
            songEnded();
        }
    } else {
        toggle.setAttribute('data-playing', 'true');
        toggleIcon.src = toggleIcons[1];
    }
}
setInterval(()=>{checkPlaying();setTimeCursor();}, 1000);

// Set time cursor
function setTimeCursor() {
    var audio = document.getElementById('audio');
    var currentTime = audio.currentTime;
    var duration = audio.duration;
    var percentage = currentTime / duration * 100;
    document.getElementById('tc').value = percentage;
    // Set time
    var time = document.getElementById('time');
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    if (minute < 10) {
        minute = '0' + minute;
    }
    time.innerHTML = hour + ':' + minute;
}

// On input time cursor
document.getElementById('tc').addEventListener('input', function() {
    var audio = document.getElementById('audio');
    var percentage = document.getElementById('tc').value;
    var duration = audio.duration;
    var currentTime = duration * percentage / 100;
    audio.currentTime = currentTime;
});

function nextSong() {
    // Go to next song
    var songQueue = getSongQueue();
    var songNumber = checkSongNumber();
    songNumber++;
    if (songNumber >= songQueue.length) {
        songNumber = 0;
    }
    var filepath = songQueue[songNumber];
    var url = 'player.html?filepath=' + filepath + '&songNumber=' + songNumber + '&queue=' + songQueue;
    location.href = url;
}
document.getElementById('next').addEventListener('click', nextSong);

var songEnded = nextSong;

// On click button#previous
function previousSong() {
    // Go to previous song if there is, if not, go back to the start of the song
    var songQueue = getSongQueue();
    var songNumber = checkSongNumber();
    songNumber--;
    if (songNumber < 0) {
        songNumber = 0;
    }
    var filepath = songQueue[songNumber];
    var url = 'player.html?filepath=' + filepath + '&songNumber=' + songNumber + '&queue=' + songQueue;
    location.href = url;
}
document.getElementById('prev').addEventListener('click', previousSong);

document.body.addEventListener('keydown', function(e) {
    // Spacebar
    if (e.which === 32) {
        toggleSong();
    }
    // Left arrow, go five seconds back
    if (e.which === 37) {
        var audio = document.getElementById('audio');
        audio.currentTime -= 5;
        // Update time cursor
        setTimeCursor();
    }
    // Right arrow, go five seconds forward
    if (e.which === 39) {
        var audio = document.getElementById('audio');
        audio.currentTime += 5;
        // Update time cursor
        setTimeCursor();
    }
});

