# Music Player

> Built by AlphaBrate

## Quick Introduction

### Built with NodeJS

> Included `electron`, `path`, `fs`, `express`, `bodyParser`, and `NodeID3`

This app can play & get the metadata of audio files. Drag the files to the home page and it will be able to play.

`Metadata Audio File Generator` Is a built tool let you easily make a mp3 file with metadata. Search powered by iTunes.

## Start

> Click on `start.vbs` to start without cmd window.
> `$> node index.js` can also start the app.

One song is preset in `assets/defaults/music` drag it to the player and play.
3 Styles are preset.

## Make changes

> All logical changes are encourage to make in `/app`

Changes in themes `/app/themes` and should edit the `/app/theme.js`

## API

The folder `player` is a suitable version for usual static websites.

> All logical change including the query `(?=)` should be made in `player.js`.

To open the site in preset code:

| type | expected file | necessity |
| --- | --- | --- |
| Audio | `/sounds/*.*(audio)`[^1] | Required |
| Image | `/img/*.jpg(image)`[^2] | Required |

[^1]: Support all types of audio file (According to the browser)
[^2]: Can be changed at `[3]` in the second section of the code.

### Code

```js
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
```

`getSongName()` and `getAlbumName()` are functions returning the name and album from query.
**CAN BE EDITED**

```js
var albumArt = '/img/' + getAlbumName() + '.jpg' /*.jpg can be changed [3]*/;
var albumArtElement = document.getElementById('albumArt');
albumArtElement.src = albumArt;
document.body.style.backgroundImage = `url(${encodeURI(albumArt)})`;
// Change song title
var songTitle = document.getElementById('title');
songTitle.innerHTML = getSongName();
// Change artist
var artist = document.getElementById('artist');
artist.innerHTML = '';                          // ENCOURAGED TO CHANGE
// Change album
var album = document.getElementById('album');
album.innerHTML = getAlbumName();
// Change year
var year = document.getElementById('year');
year.innerHTML = '';                            // ENCOURAGED TO CHANGE
// Change audio source
var audio = document.getElementById('audio');
audio.src = '/sounds/' + getSongName() + '.mp3';
```

Get the elements and set those src and contents.
**NOT ENCOURAGED TO CHANGE ELEMENTS**

