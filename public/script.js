
var songlist;
var songindex;
var songlength;
var songInfo = false;
songInfo = false;
var channelowner = true;
var channel;
var songinterval;
if (document.getElementById("player") == null) {
  channelowner = false;
}
if (channelowner)
  document.getElementById("songInfo").setAttribute("style", "display:none");



// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var pageLoaded = false;
function loadPage() {
  pageLoaded = true;
  channel = document.getElementById("channel").value;
  username = document.getElementById("user").value;
  if (username != "") {
    document.getElementById('requestButton').setAttribute("onclick", "displaySongRequest()");
    document.getElementById('requestInputField').setAttribute("onblur", "setTimeout(function(){hideSongRequest()},250)");
    document.getElementById('submitRequestButton').setAttribute("onclick", "submitSongRequest()");
  }
  if (channelowner) {
    document.getElementById("play").setAttribute("onclick", "playPause(this)");
    document.getElementById("skip").setAttribute("onclick", "skipSong()");
  }
  else {
    if (document.getElementById("loginButton")) {
      document.getElementById("loginButton").setAttribute("onclick", "window.location.href='/api/login?request=twitchauthlink&redirect=1'");
    }
    if (channel != "User not logged in.") {
      getsongs();
      songinterval = setInterval(function () { getsongs() }, 60000);
    }
    else {
      document.getElementById('login').innerHTML = "You must be logged in to view this page." + document.getElementById('login').innerHTML.slice(document.getElementById('login').innerHTML.indexOf("<"));
      document.getElementsByTagName('table')[0].setAttribute("style", "display:none");
      document.getElementById('login').setAttribute("style", "text-align:unset");
      document.getElementById('songInfo').setAttribute("style", "display:none");
    }
  }

}
// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: '',
    playerVars: {
      autoplay: 0,
      controls: 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  if (pageLoaded == false) {
    loadPage();
  }
}
var interval;
function timer() {

  document.getElementById("timer").innerHTML = Math.floor(player.getCurrentTime() / 60) + ":" + (Math.floor(player.getCurrentTime()) % 60 < 10 ? "0" + Math.floor(player.getCurrentTime()) % 60 : Math.floor(player.getCurrentTime()) % 60) + "  /  " + Math.floor(player.getDuration() / 60) + ":" + (Math.floor(player.getDuration()) % 60 < 10 ? "0" + Math.floor(player.getDuration()) % 60 : Math.floor(player.getDuration()) % 60);
}
function playPause(e) {
  if (loaded) {
    if (!playing) {
      playing = !playing;
      e.innerHTML = 'Pause';
      player.playVideo()
      interval = setInterval(function () { timer() }, 1000);
    }
    else {
      playing = !playing;
      e.innerHTML = 'Resume';
      player.pauseVideo();
      clearInterval(interval);
    }
  }
}
// 4. The API will call this function when the video player is ready.
var loaded = false;
function onPlayerReady(event) {
  loaded = true;
  getsongs();

}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function validURL(url) {
  let temp;
  if (url.search(/^https?\:\/\/(([A-Z\-_a-z0-9])+(\.)[0-9,\-_a-z\.]+|localhost)+(\/[\.a-z%:_+A-Z0-9\?\/\&\=]*)?$/) != -1) {
    temp = new URL(url);
    temp.protocol = "https://";
    return temp;
  }

}
function parseUrlParam(url) {
  let json = "";
  url.search.slice(1).split("&").forEach(function (t) {
    json += '"';
    json += t.split("=")[0];
    json += '" : "';
    json += t.split("=")[1];
    json += '", ';
  })
  let temp = "";
  for (let i = 0; i < json.length - 2; i++) {
    temp += json[i];
  }
  temp;
  json = JSON.parse("{" + temp + "}");
  return json;
}
function requestSong(song, user) {
  //todo
  let url = validURL(song);
  if (url) {
    if (url.protocol == "http:") {
      url.protocol = "https:";
    }
    if (url.host == "youtube.com") {
      url.host = "www.youtube.com";
    }
    if (url.host == "www.youtube.com") {
      let query = parseUrlParam(url);
      if (query["v"] != undefined) {
        fetch("/api/songqueue?request=insertsong&channel=" + channel, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            requestedBy: username, url: url.href
          })
        })
          .then(data => data.text())
          .then(function (response) { console.log(response); getsongs() })

      }
    }

  }
  else {
    fetch("/api/songqueue?request=insertsong&channel=" + channel, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requestedBy: username, title: song
      })
    })
      .then(data => data.text())
      .then(function (response) { console.log(response); getsongs() })
  }
  console.log(user + " wants to request the song " + song);
}
function deleteSong(song, user) {
  //todo
  console.log(user + " wants to delete the song at queue " + song);
  fetch("/api/songqueue?request=deletesong&channel=" + channel, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "requestedBy": username, "queue": song
    }),
  })
    .then(data => data.text())
    .then(function (response) { console.log(response); getsongs(); })
}
function onPlayerStateChange(event) {
  //console.log("state changed state:",event);
  if (event.data == 5 && channelowner) {
    let videoData = player.getVideoData();
    if (songlength > 0) {
      document.getElementById("currentSong").innerHTML = songlist[0].title;
      document.getElementById("thumbNail").innerHTML = "<img src=" + getThumbNail(videoData.video_id) + " width=280 height=280 />";
    }
    else {
      document.getElementById("currentSong").innerHTML = "";
      document.getElementById("thumbNail").innerHTML = "";
      player.clearVideo();
    }
  }
  //console.log(event,JSON.stringify(event));
  if (event.data == 0 && channelowner) {
    console.log("finished playing.");
    nextSong(true);

  }
}
function getThumbNail(id) { return "https://i.ytimg.com/vi/" + id + "/sddefault.jpg" };
function stopVideo() {
  player.stopVideo();
}
function skipSong() {
  if (channelowner) {
    player.stopVideo();
    document.getElementById("currentSong").innerHTML = "";
    document.getElementById("thumbNail").innerHTML = "";
    document.getElementById("timer").innerHTML = "";
    player.clearVideo();
    popSong();
    nextSong();
  }
}
function popSong(callback) {
  if (channelowner) {
    fetch("/api/songqueue?request=popfromqueue&channel=" + channel, { method: "POST" })
      .then((data) => data.text())
      .then(function (data) {
        getsongs();
        if (typeof (callback) == "function")
          callback();
      });
  }
}
function nextSong(force) {
  if (channelowner) {
    if (force || (songlength > 0 && songlist[0].queue != 0)) {
      songlength--;
      popSong(function () {
        if (songindex < songlength) {
          if (!songInfo) {
            songInfo = true;
            document.getElementById("songInfo").setAttribute("style", "display:block");
          }
          player.cueVideoById(songlist[songindex].songURL.slice(32));
          document.getElementById('currentSong').innerHTML = songlist[songindex].title;
          if (playing) player.playVideo();
          songindex++;


        }
        else {
          songsloaded = false;
          player.stopVideo();
          playing = false;
          clearInterval(interval);
          document.getElementById("timer").innerHTML = "";
          document.getElementById('play').innerHTML = 'Play';
          songInfo = false;
          document.getElementById("songInfo").setAttribute("style", "display:none");
        }
      });
      console.log("song popped.")
    }
    else {
      if (songindex < songlength) {
        if (!songInfo) {
          songInfo = true;
          document.getElementById("songInfo").setAttribute("style", "display:block");
        }
        player.cueVideoById(songlist[songindex].songURL.slice(32));
        document.getElementById('currentSong').innerHTML = songlist[songindex].title;
        if (playing) player.playVideo();
        songindex++;


      }
      else {
        songsloaded = false;
        player.stopVideo();
        playing = false;
        clearInterval(interval);
        document.getElementById("timer").innerHTML = "";
        document.getElementById('play').innerHTML = 'Play';
        songInfo = false;
        document.getElementById("songInfo").setAttribute("style", "display:none");
      }
    }

  }
}
function displaySongRequest() {
  document.getElementById('requestInputField').setAttribute("type", "text");
  document.getElementById('submitRequestButton').setAttribute("type", "button");
  document.getElementById('requestInputField').focus();
}
function hideSongRequest() {
  document.getElementById('requestInputField').setAttribute("type", "hidden");
  document.getElementById('submitRequestButton').setAttribute("type", "hidden");
  document.getElementById('requestInputField').value = "";
}
function submitSongRequest() {
  let song = document.getElementById('requestInputField').value;
  hideSongRequest();
  requestSong(song, username);
}
var songsloaded = false;
function getsongs() {
  if (pageLoaded == false && !channelowner) {
    pageLoaded = true;
    channel = document.getElementById("channel").value;
    username = document.getElementById("user").value;
  }
  fetch("/api/songqueue?request=getsongs&channel=" + channel)
    .then((data) => data.json())
    .then(function (songs) {
      document.getElementsByTagName("tbody")[0].innerHTML = "";
      songlist = songs;
      songindex = 0;
      songlength = songs.length;
      if (songs.length > 0) {
        if(songs.length==1 && songs[0].queue==0)
        {
          document.getElementsByTagName("tbody")[0].innerHTML += "<tr><td colspan='8'>The playlist is empty. Try requesting a song.</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
        }
        if (songsloaded == false) {
          for (let i = 0; i < songs.length; i++) {
            if (songs[i].queue > 0) {
              document.getElementsByTagName("tbody")[0].innerHTML += "<tr><td>" + (songs[i].queue) + "</td><td>"
                + songs[i].title + "</td><td>" + songs[i].length + "</td><td>" + songs[i].views + "</td><td>" + songs[i].likeCount +
                "</td><td>" + songs[i].dislikeCount + "</td><td><a href=" + songs[i].songURL + " rel=nofollow target=_BLANK>" + songs[i].songURL + "</a></td><td>" + songs[i].requestedBy + "</td><td>" + (songs[i].requestedBy == username || username == channel ? "<button class='delete-btn' onclick=deleteSong(" + songs[i].queue + ",'" + username + "')>delete</button>" : "") + "<td></tr>";
            }
            else {
              document.getElementById("currentSong").innerHTML = songs[i].title;
            }
          }
          if (typeof (player) != "undefined") nextSong();
          if (songlength > 0)
            songsloaded = true;
        }
        else {
          for (let i = 0; i < songs.length; i++) {
            if (songs[i].queue > 0) {
              document.getElementsByTagName("tbody")[0].innerHTML += "<tr><td>" + (songs[i].queue) + "</td><td>"
                + songs[i].title + "</td><td>" + songs[i].length + "</td><td>" + songs[i].views + "</td><td>" + songs[i].likeCount +
                "</td><td>" + songs[i].dislikeCount + "</td><td><a href=" + songs[i].songURL + " rel=nofollow target=_BLANK>" + songs[i].songURL + "</a></td><td>" + songs[i].requestedBy + "</td><td>" + (songs[i].requestedBy == username || username == channel ? "<button class='delete-btn' onclick=deleteSong(" + songs[i].queue + ",'" + username + "')>delete</button>" : "") + "<td></tr>";
            }
            else {
              document.getElementById("currentSong").innerHTML = songs[i].title;
            }
          }
        }
      }
      else {
        if (!songsloaded && songInfo) {
          songInfo = false;
          document.getElementById("songInfo").setAttribute("style", "display:none");
        }
        document.getElementsByTagName("tbody")[0].innerHTML += "<tr><td colspan='8'>The playlist is empty. Try requesting a song.</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
      }
    });
}


var playing = false;