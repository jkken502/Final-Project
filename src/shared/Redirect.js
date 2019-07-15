import React from 'React';
import {withRouter} from 'react-router';
//import {playPause,skipSong,getsongs,nextSong} from "../browser/script";
import { Link } from 'react-router-dom'

class Redirect extends React.Component {
  constructor(props) {
    super(props)
    if(__isBrowser__){
      window.location.href="/songlist/";
    }
    else{
    this.props.history.push('/songlist/');
    }
  }
  
  render(){
  
  return (
    <div>
      <a href="/songlist/">Check out the songlist</a>
    </div>
  )
}
}
export default withRouter(Redirect);

/*
class Redirect extends React.Component {

  render(){
  
    return (
      <div id="main">
      <div id="songInfo">
        Currently Playing:
      <div id="thumbNail"></div>
        <div id="currentSong"></div>
        <div id="timer"></div>
        <button id="play">Play</button>
        <button id="skip">Skip Song</button>
        </div>
      <div id="player"></div>
          <table><thead><tr><th>Queue</th><th>title</th><th>length</th><th>views</th><th>likeCount</th><th>dislikeCount</th><th>songURL</th><th>requestedBy</th><th>Delete</th></tr></thead><tbody></tbody></table>
      <script src="script.js" defer>
      </script>
      </div>
      
    )
  }
}
export default Redirect;*/