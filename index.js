// Hide the native player controls
const video = document.getElementById('video');
const videoControls = document.getElementById('video-controls');

const videoWorks = document.createElement('video').canPlayType;
if(videoWorks)
{
    video.controls = false;
    videoControls.classList.remove('hidden');
}

// Toggle playback
const playButton = document.getElementById('play');

// If the video is paused or has ended and the user clicks on it, it will play the video
// If the video is already playing and the user clicks on it, it will pause the video
function togglePlay()
{
  console.log(video.currentTime);
    if(video.paused || video.ended)
    {
        video.play();
    }
    else
    {
        video.pause();
    }
}
// Event Listeners
playButton.addEventListener('click',togglePlay);

// Updates the play pause button
const playbackIcons = document.querySelectorAll('.playback-icons use');

//updatePlayButton updates the playback icon and tooltip depending on the playback state

function updatePlayButton()
{
    playbackIcons.forEach(icon => icon.classList.toggle('hidden'));
    if(video.paused || video.ended)
    {
        playButton.setAttribute('data-title', 'Play (k)');
    }
    else
    {
        playButton.setAttribute('data-title', 'Pause (k)');
    }
}

video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);

// displays elapsed video time and the duration
const timeElapsed = document.getElementById('time-elapsed');
const duration = document.getElementById('duration');

function formatTime(timeInSeconds)
{
    const result = new Date(timeInSeconds * 1000).toISOString().substring(11,19);
    // console.log(result);
    const hours = result.substring(0,2)
    const minutes = result.substring(3,5);
    const seconds = result.substring(6,8);
    // console.log(hours);
    // console.log(minutes);
    // console.log(seconds);
    return [minutes, seconds];
}

// gives the duration of the time
// TODO: Add the hours
video.addEventListener('loadedmetadata', initializeVideo);

// displays the elapsed time in a video
function updateTimeElapsed() 
{
    const time = formatTime(Math.round(video.currentTime));
    timeElapsed.innerText = `${time[0]}:${time[1]}`;
    timeElapsed.setAttribute('datetime', `${time[0]}m ${time[1]}s`);
}

video.addEventListener('timeupdate', updateTimeElapsed);

const progressBar = document.getElementById('progress-bar');
const seek = document.getElementById('seek');

function initializeVideo() 
{
    const videoDuration = Math.round(video.duration);
    seek.setAttribute('max', videoDuration);
    progressBar.setAttribute('max', videoDuration);
    const time = formatTime(videoDuration);
    duration.innerText = `${time[0]}:${time[1]}`;
    duration.setAttribute('datetime', `${time[0]}m ${time[1]}s`);
}

// updateProgress indicates how far through the video
// the current playback is by updating the progress bar
function updateProgress() 
{
    seek.value = Math.floor(video.currentTime);
    progressBar.value = Math.floor(video.currentTime);
}

video.addEventListener('timeupdate', updateProgress);

// skip ahead
const seekTooltip = document.getElementById('seek-tooltip');

// updateSeekTooltip uses the position of the mouse on the progress bar to
// roughly work out what point in the video the user will skip to if
// the progress bar is clicked at that point
function updateSeekTooltip(event) 
{
    const skipTo = Math.round((event.offsetX / event.target.clientWidth) * parseInt(event.target.getAttribute('max'), 10));
    seek.setAttribute('data-seek', skipTo);
    const time = formatTime(skipTo);
    seekTooltip.textContent = `${time[0]}:${time[1]}`;
    const rect = video.getBoundingClientRect();
    seekTooltip.style.left = `${event.pageX - rect.left}px`;
}

seek.addEventListener('mousemove', updateSeekTooltip);


// skipAhead jumps to a different point in the video when
// the progress bar is clicked
function skipAhead(event) {
  const skipTo = event.target.dataset.seek ? event.target.dataset.seek : event.target.value;
  video.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
}

seek.addEventListener('input', skipAhead);

// skip ahead by 10 seconds

function skip10Seconds(event)
{
  const skipTen = video.currentTime + 10;
  const time = formatTime(skipTen);
  video.currentTime = skipTen;
  progressBar.value = skipTen;
  seek.value = skipTen;
}

video.addEventListener('click', skip10Seconds);

function goBack10Seconds(event)
{
  const skipTen = video.currentTime - 10;
  const time = formatTime(skipTen);
  video.currentTime = skipTen;
  progressBar.value = skipTen;
  seek.value = skipTen;
}

video.addEventListener('click', goBack10Seconds);

const volumeButton = document.getElementById('volume-button');
const volumeIcons = document.querySelectorAll('.volume-button use');
const volumeMute = document.querySelector('use[href="#volume-mute"]');
const volumeLow = document.querySelector('use[href="#volume-low"]');
const volumeHigh = document.querySelector('use[href="#volume-high"]');
const volume = document.getElementById('volume');

function updateVolume() 
{
    if (video.muted) {
      video.muted = false;
    }
  
    video.volume = volume.value;
}

volume.addEventListener('input', updateVolume);

// updateVolumeIcon updates the volume icon so that it correctly reflects
// the volume of the video
function updateVolumeIcon() 
{
    volumeIcons.forEach(icon => {
      icon.classList.add('hidden');
    });
  
    volumeButton.setAttribute('data-title', 'Mute (m)');
  
    if (video.muted || video.volume === 0) 
    {
      volumeMute.classList.remove('hidden');
      volumeButton.setAttribute('data-title', 'Unmute (m)');
    } 
    else if (video.volume > 0 && video.volume <= 0.5) 
    {
      volumeLow.classList.remove('hidden');
    } 
    else 
    {
      volumeHigh.classList.remove('hidden');
    }
}

video.addEventListener('volumechange', updateVolumeIcon);

// toggleMute mutes or unmutes the video when executed
// When the video is unmuted, the volume is returned to the value
// it was set to before the video was muted
function toggleMute() 
{
    video.muted = !video.muted;
  
    if (video.muted) 
    {
      volume.setAttribute('data-volume', volume.value);
      volume.value = 0;
    } 
    else 
    {
      volume.value = volume.dataset.volume;
    }
}

volumeButton.addEventListener('click', toggleMute);

const playbackAnimation = document.getElementById('playback-animation');

// animatePlayback displays an animation when
// the video is played or paused
// allows for toggling pause or play on the video itself
function animatePlayback() 
{
    playbackAnimation.animate([
      {
        opacity: 1,
        transform: "scale(1)",
      },
      {
        opacity: 0,
        transform: "scale(1.3)",
      }], {
      duration: 500
    });
    
}

video.addEventListener('click', togglePlay);
video.addEventListener('click', animatePlayback);

// full screen the video
const fullscreenButton = document.getElementById('fullscreen-button');
const videoContainer = document.getElementById('video-container');

// toggleFullScreen toggles the full screen state of the video
// If the browser is currently in fullscreen mode,
// then it should exit and vice versa.
function toggleFullScreen() 
{
    if (document.fullscreenElement) 
    {
      document.exitFullscreen();
    } 
    else if (document.webkitFullscreenElement) 
    {
      // Need this to support Safari
      document.webkitExitFullscreen();
    } 
    else if (videoContainer.webkitRequestFullscreen) 
    {
      // Need this to support Safari
      videoContainer.webkitRequestFullscreen();
    } 
    else 
    {
      videoContainer.requestFullscreen();
    }
}

// fullscreen support
fullscreenButton.onclick = toggleFullScreen;
const fullscreenIcons = fullscreenButton.querySelectorAll('use');

function updateFullscreenButton() 
{
    fullscreenIcons.forEach(icon => icon.classList.toggle('hidden'));
  
    if (document.fullscreenElement) {
      fullscreenButton.setAttribute('data-title', 'Exit full screen (f)')
    } else {
      fullscreenButton.setAttribute('data-title', 'Full screen (f)')
    }
}

videoContainer.addEventListener('fullscreenchange', updateFullscreenButton);


// picture in picture
document.addEventListener('DOMContentLoaded', () => {
    if (!('pictureInPictureEnabled' in document)) {
      pipButton.classList.add('hidden');
    }
});

const pipButton = document.getElementById('pip-button')

async function togglePip() 
{
    try 
    {
      if (video !== document.pictureInPictureElement) {
        pipButton.disabled = true;
        await video.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } 
    catch (error) 
    {
      console.error(error)
    } 
    finally 
    {
      pipButton.disabled = false;
    }
}

pipButton.addEventListener('click', togglePip);

// toggle video controls
function hideControls() 
{
    if (video.paused) {
      return;
    }
  
    videoControls.classList.add('hide');
}
  
// showControls displays the video controls
function showControls() 
{
    videoControls.classList.remove('hide');
}

//change the display video

const oldVideoTitle = document.getElementById('videoSource');
const newVideoThumb = document.getElementsByClassName('thumbVideo');

// changing videos.
// swaps the video that is currently being played
function changeVideo(element)
{
  var newVideo = "";
  var oldVideoSource = "";
  var indexSpace = 0;
  var tempURL = "";
  var posVideo = 0;
  var newURL = "";
  var newTitle = "";
  var parent = "";
  

  //console.log(element.getAttribute('value'));
  console.log(element);
  var val = element.getAttribute('value');
  var selectVideo = document.getElementById('video'+val);

  // first part changes the video
  // grabbing the video that will be played
  video.pause();
  newVideo = selectVideo.alt;

  // changes the title to the newly selected video
  // performs swap of the old and new title
  newTitle = document.getElementById('title'+val);
  tempTitle = newTitle.textContent;
  const oldVideoTitleText = document.getElementById('videoTitle');
  previousTitle = oldVideoTitleText.textContent;
  oldVideoTitleText.textContent = tempTitle; 
  oldVideoTitle.setAttribute('data-title',tempTitle);
  
  // grabs the video that will be swapped out
  oldVideoSource = oldVideoTitle.src;
  // check if video link have spaces assumes only one space
  if(newVideo.includes(" "))
  {
    indexSpace = newVideo.indexOf(" ");
    tempURL = newVideo.slice(0,indexSpace) + '%20' + newVideo.slice(indexSpace+1);
  }
  else
  {
    tempURL = newVideo;
  }
  // finds the index of video and 
  //slices the video combining the previous video link and the new video link
  posVideo = oldVideoSource.indexOf("video");
  newURL = oldVideoSource.slice(0,posVideo) + tempURL;
  // sets the new url
  oldVideoTitle.setAttribute('src',newURL);

  // switches the old video to the thumbnail 
  selectVideo.setAttribute('alt',oldVideoSource.slice(posVideo));

  // replaces the selected title to the old title
  // var oldTitle = oldVideoTitle.getAttribute('data-title');
  var videoTitle = document.getElementById('title'+val);
  // console.log(oldTitle);
  videoTitle.textContent = previousTitle;
  videoTitle.setAttribute('data-title',previousTitle);
  // parent.setAttribute('data-title',oldTitle);
  // parent.textContent = oldTitle;

  // plays the video
  
  video.load();
  video.play();
  updatePlayButton();
}



var lenThumb = newVideoThumb.length;
// loop through the entire collection of newThumbs
for (var i = 0; i <lenThumb; i++)
{
  newVideoThumb[i].addEventListener('click', changeVideo);
}


video.addEventListener('mouseenter', showControls);
video.addEventListener('mouseleave', hideControls);
videoControls.addEventListener('mouseenter', showControls);
videoControls.addEventListener('mouseleave', hideControls);

// keyboardShortcuts executes the relevant functions for
// each supported shortcut key
function keyboardShortcuts(event) 
{
    const {key} = event;
    switch(key)
    {
      case "k":
        togglePlay();
        animatePlayback();
        if (video.paused)
        {
          showControls();
        } 
        else 
        {
          setTimeout(() => {
            hideControls();
          }, 2000);
        }
        break;
      case " ":
        togglePlay();
        animatePlayback();
        if (video.paused)
        {
          showControls();
        } 
        else 
        {
          setTimeout(() => {
            hideControls();
          }, 2000);
        }
        break;
      case "m":
        toggleMute();
        break;
      case "f":
        toggleFullScreen();
        break;
      case "p":
        togglePip();
        break;
      case "l":
        skip10Seconds();
        break;
      case "j":
        goBack10Seconds();
        break;
    }
}

document.addEventListener('keyup', keyboardShortcuts);