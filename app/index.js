/*
<span>
    <input type="text" name="filepath" class="filepath">
    <button>Add</button>
</span>
 */

function addSong(w) {
    // w = this
    var filepath = w.previousElementSibling.value;
    // Check all possible things that could go wrong
    // Check if the input is empty
    if (filepath === '') {
        notify('Please enter a filepath.','Alert!');
        return;
    }
    // Check if the input is blank, or only contains spaces
    if (filepath.trim() === '') {
        notify('Please enter a correct filepath.','Alert!');
        return;
    }
    // Check if the song is already in the queue
    var queue = document.getElementById('queue');
    var songs = queue.children;
    for (var i = 0; i < songs.length; i++) {
        if (songs[i].firstElementChild.innerHTML === filepath) {
            notify('This song is already in the queue.','Alert!');
            return;
        }
    }
    // Rewrite the filepath if it contains "" or ''
    filepath = filepath.replace(/"/g, '');
    filepath = filepath.replace(/'/g, ''); 
    // Set
    w.previousElementSibling.value = '';
    // Add song to #queue
    var queue = document.getElementById('queue');
    var song = document.createElement('div');
    song.className = 'song';
    song.innerHTML = '<span class="song-title">' + filepath + '</span><button class="remove">Remove</button>';
    queue.appendChild(song);
    // Add event listener to button.remove
    song.lastElementChild.addEventListener('click', function() {
        removeSong(this);
    });
}

// Remove
function removeSong(w) {
    // w = this
    var song = w.parentElement;
    song.remove();
}

// Get song list and make up the queue
function getSongList() {
    var queue = document.getElementById('queue');
    var songs = queue.children;
    // If no song in the queue, return
    if (songs.length === 0) {
        notify('Please add at least one song.','Alert!');
        return;
    }
    var songList = [];
    for (var i = 0; i < songs.length; i++) {
        songList.push(songs[i].firstElementChild.innerHTML);
    }
    // Make up a song queue Url
    var songListUrl = 'player.html?';
    for (var i = 0; i < songList.length; i++) {
        songListUrl += 'filepath=' + songList[i] + '&';
    }
    songListUrl += 'queue=' + songList;
    // Set last played song queue
    localStorage.setItem('lastPlayed',songListUrl);
    location.href=songListUrl;
    return songListUrl;
}

var lastMessage;
function notify(message,type) {
    // fetch(`http://localhost:2367/winNotify?title=${type}&body=${message}`);
    // Don't notify when it is same to the last notification
    if (message === lastMessage) {
        return;
    }
    lastMessage = message;
    fetch(`http://localhost:2367/winNotify?title=${type}&body=${message}`);
}


var last = document.getElementById('last');
// Play the last played song queue
last.addEventListener('click', function() {
    var lastPlayed = localStorage.getItem('lastPlayed');
    if (lastPlayed === null) {
        notify('No last played song queue.','Alert!');
        return;
    }
    window.location.href = lastPlayed;
});

// Make a drop area
var dropArea = document.body;
// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});
function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}
// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
}
);
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
}
);
function highlight(e) {
    dropArea.classList.add('highlight');
}
function unhighlight(e) {
    dropArea.classList.remove('highlight');
}

// Handle dropped things, if a file, get path. If a string, get string
dropArea.addEventListener('drop', handleDrop, false);
function handleDrop(e) {
    var dt = e.dataTransfer;
    var files = dt.files;
    if (files.length > 0) {
        // Handle files
        handleFiles(files);
    } else {
        // Handle string
        var text = dt.getData('text/plain');
        // Check
        if (text === '') {
            notify('Please enter a filepath.','Alert!');
            return;
        }
        // Check if the input is blank, or only contains spaces
        if (text.trim() === '') {
            notify('Please enter a correct filepath.','Alert!');
            return;
        }
        // Check if the song is already in the queue
        var queue = document.getElementById('queue');
        var songs = queue.children;
        for (var i = 0; i < songs.length; i++) {
            if (songs[i].firstElementChild.innerHTML === text) {
                notify('This song is already in the queue.','Alert!');
                return;
            }
        }
        // Rewrite the filepath if it contains "" or ''
        text = text.replace(/"/g, '');
        text = text.replace(/'/g, '');
        var song = document.createElement('div');
        song.className = 'song';
        song.innerHTML = '<span class="song-title">' + text + '</span><button class="remove">Remove</button>';
        queue.appendChild(song);
        // Add event listener to button.remove
        song.lastElementChild.addEventListener('click', function() {
            removeSong(this);
        });
    }
}

// Handle files
function handleFiles(files) {
    ([...files]).forEach(uploadFile);
}
function uploadFile(file) {
    var queue = document.getElementById('queue');
    var song = document.createElement('div');
    song.className = 'song';
    song.innerHTML = '<span class="song-title">' + file.path + '</span><button class="remove">Remove</button>';
    queue.appendChild(song);
    // Add event listener to button.remove
    song.lastElementChild.addEventListener('click', function() {
        removeSong(this);
    });
}

// X Fullscreen
fetch('http://localhost:2367/fullscreen/false', {
    method: 'POST'
});