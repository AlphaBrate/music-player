// This Open-sourced player by AlphaBrate is under the MIT license.
// As this project is done by individual from AlphaBrate, the terms, naming may not be professional.
// © AlphaBrate 2022
// File: player.js
// Get search query from url
function getSongName() {
    var url = window.location.href;
    var query = url.split('?');
    // decode
    return decodeURI(query[1].split('=')[1].split('&')[0]);
}

function getAlbumName() {
    var url = window.location.href;
    var query = url.split('&');
    return decodeURI(query[1].split('=')[1]);
}

var albumArt = '/img/' + getAlbumName() + '.jpg';
var albumArtElement = document.getElementById('albumArt');
albumArtElement.src = albumArt;
document.body.style.backgroundImage = `url(${encodeURI(albumArt)})`;
// Change song title
var songTitle = document.getElementById('title');
songTitle.innerHTML = getSongName();
// Change artist
var artist = document.getElementById('artist');
artist.innerHTML = 'ReTrn';
// Change album
var album = document.getElementById('album');
album.innerHTML = getAlbumName();
// Change year
var year = document.getElementById('year');
year.innerHTML = '';
// Change audio source
var audio = document.getElementById('audio');
audio.src = '/sounds/' + getSongName() + '.mp3';
