var api = 'https://itunes.apple.com/search?term={}&limit={}&country=CN';
var output = [];
var search = () => {
    var term = document.getElementById('search').value;
    var limit = 4;
    var url = api.replace('{}', term).replace('{}', limit);
    document.getElementById("searcher").style.display = "none";
    document.getElementById("results").style.display = "block";
    var results = document.getElementById('results');
    results.innerHTML = '';
    try {
        fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }).then(res => res.json()).then(json => {
            results.innerHTML = '';
            if (json.resultCount == 0) {
                results.innerHTML = '<div class="err"><span class="nores result">No results found :(</span><button onclick="rs()" class="mid">Return</button></div>';
                return;
            }
            var artworkUrl3000 = json.results[0].artworkUrl100.replace('100x100', '3000x3000');
            document.body.style.backgroundImage = `url(${artworkUrl3000})`;
            for (var i = 0; i < json.results.length; i++) {
                json.results[i].releaseDate = json.results[i].releaseDate.split('T')[0];
                output.push(json.results[i]);
                var result = `
                    <span class="result">
                        <div class="wrap-left">
                            <img src="${json.results[i].artworkUrl100}" alt="">
                        </div>
                        <div class="wrap-middle">
                            <span class="title">${json.results[i].trackCensoredName}</span>
                            <span class="artist">${json.results[i].artistName}</span>
                            <span class="album">${json.results[i].collectionName}</span>
                            <span class="releaseDate">${json.results[i].releaseDate.split('-')[0]}</span>
                        </div>
                        <div class="wrap-right">
                            <audio src="${json.results[i].previewUrl}" class="preview" controls></audio>
                            <button onclick="edit(${i})">Edit</button>
                        </div>
                    </span>
                    `;
                results.innerHTML += result;
            }
            results.innerHTML += `<button onclick="edit()" class="mid">Customize</button>`;
            results.innerHTML += `<button onclick="rs('search')" class="mid">Return</button>`;
        }).error(err => {
            results.innerHTML += `<button onclick="edit()" class="mid">Customize</button>`;
            results.innerHTML = `<div class="err"><span class="nores result">An Error had Occured :(</span><button onclick="rs('search')" class="mid">Return</button></div>`;
        });
    } catch {
        results.innerHTML = `<div class="err"><span class="nores result">An Error Occured :(</span><button onclick="rs('search')" class="mid">Return</button></div>`;
    }
}


var rs = (e) => {
    // console.log(e);
    if (e == "search") {
        location.reload();
    } else if (e == "results") {
        document.getElementById("pps").style.display = "none";
        document.getElementById("results").style.display = "block";
    }
    let audios = document.getElementsByTagName('audio');
    for (var i = 0; i < audios.length; i++) {
        audios[i].pause();
    }
}

var urlImageToBase64 = (url) => {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };
        img.onerror = error => {
            reject(error);
        };
        img.src = url;
    });
}


var edit = (n=-1) => {
    var result = output[n];
    // console.log(result);
    let artist = document.getElementById('a');
    let album = document.getElementById('al');
    let title = document.getElementById('t');
    let year = document.getElementById('y');
    let artwork = document.getElementById('artwork');

    if (n == -1) {
        artist.value = album.value = title.value = year.value = artwork.src = "";
        document.body.style.backgroundImage = `url(../assets/icons/svg/placeholder.svg)`;

        document.getElementById('searcher').style.display = 'none';
        document.getElementById('pps').style.display = 'flex';
        document.getElementById('results').style.display = 'none';

        let audios = document.getElementsByTagName('audio');
        for (var i = 0; i < audios.length; i++) {
            audios[i].pause();
        }
        return;
    }

    let artworkUrl200 = result.artworkUrl100.replace('100x100', '200x200');
    let artworkUrl3000 = result.artworkUrl100.replace('100x100', '3000x3000');

    urlImageToBase64(artworkUrl200).then(data => {
        artwork.src = data;
    }).catch(err => {
        console.log(err);
    });

    artist.value = result.artistName;
    album.value = result.collectionName;
    title.value = result.trackCensoredName;
    year.value = result.releaseDate.split('-')[0];
    artwork.src = artworkUrl200;
    document.body.style.backgroundImage = `url(${artworkUrl3000})`;

    document.getElementById('searcher').style.display = 'none';
    document.getElementById('pps').style.display = 'flex';
    document.getElementById('results').style.display = 'none';

    let audios = document.getElementsByTagName('audio');
    for (var i = 0; i < audios.length; i++) {
        audios[i].pause();
    }
}

var artist = document.getElementById('a');
var album = document.getElementById('al');
var title = document.getElementById('t');
var year = document.getElementById('y');
var artwork = document.getElementById('artwork');
var audio = document.getElementById('audioPreview');

var download = () => {
    if (artist.value == "" || album.value == "" || title.value == "" || year.value == "" || artwork.src == "" || audio.src == "") {
        document.getElementById('pps').style.animation = 'shake 0.5s';
        setTimeout(() => {
            document.getElementById('pps').style.animation = '';
        }, 500);
        return;
    }

    var json = {};

    json.artist = artist.value;
    json.album = album.value;
    json.title = title.value;
    json.year = year.value;
    json.audio = audio.src;
    let bodyBackground = document.body.style.backgroundImage;
    urlImageToBase64(bodyBackground.substring(5, bodyBackground.length - 2)).then(data => {
        json.artwork = data;
        console.log(json);
        var data = JSON.stringify(json);
        fetch('http://localhost:2367/downloadMp3WithTags', {
            method: 'POST',
            cors: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data
        }).then(res => res.text()).then(res => {
            // download the file
            var a = document.createElement('a');
            a.href = res;
            a.download = `${json.artist} - ${json.title}.mp3`;
            a.click();
            a.remove();
        });
    });
}

document.getElementById("art").addEventListener('change', (e) => {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        var url = reader.result;
        document.body.style.backgroundImage = `url(${url})`;
        document.getElementById("artwork").src = url;
    }
    reader.onerror = function (error) {
        console.log('Error: ', error);
    }
});

document.getElementById("mus").addEventListener('change', (e) => {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        var url = reader.result;
        document.getElementById("audioPreview").src = url;
    }
    if (document.getElementById("audioPreview").src != null) {
        document.getElementById("audioPreview").style.display = "block";
        document.getElementById("uplmp3").style.background = "#66f184";
        document.getElementById("uplmp3").style.border = "1px solid #66f184";
    }
});
