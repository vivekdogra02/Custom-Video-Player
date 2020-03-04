const video = document.getElementById('video');
const play = document.getElementById('play');
const stop = document.getElementById('stop');
const progress = document.getElementById('progress');
const timestamp = document.getElementById('timestamp');

// play and pause video
function toggleVideoStatus() {
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

// update the play and pause icon
function updatePlayIcon() {
    if(video.paused) {
        play.innerHTML = '<i class="fa fa-play fa-2x"></i> ';
    } else {
        play.innerHTML = '<i class="fa fa-pause fa-2x"></i> ';
    }
}

// update the progress and timestamp
function updateProgress() {
    progress.value = (video.currentTime / video.duration) * 100;

    // get minutes
    let mins = Math.floor(video.currentTime/60);
    if(mins < 10) {
        mins = '0'+ String(mins);
    }

    // get seconds
    let secs = Math.floor(video.currentTime % 60);
    if(secs < 10) {
        secs = '0'+ String(secs);
    }

    timestamp.innerHTML = `${mins}:${secs}`;
}

// set video progress 
function setVideoProgress() {
    video.currentTime = (+progress.value * video.duration) / 100;
}
//stop video
function stopVideo() {
    video.currentTime = 0;
    video.pause();
}

let pipWindow;

togglePipButton.addEventListener('click', async function(event) {
  togglePipButton.disabled = true;
  try {

    if (video !== document.pictureInPictureElement)
      await video.requestPictureInPicture();
    else
      await document.exitPictureInPicture();

  } catch(error) {
    console.log(`> Argh! ${error}`);
  } finally {
    togglePipButton.disabled = false;
  }
});

// Note that this can happen if user clicked the "Toggle Picture-in-Picture"
// button but also if user clicked some browser context menu or if
// Picture-in-Picture was triggered automatically for instance.
video.addEventListener('enterpictureinpicture', function(event) {
  pipWindow = event.pictureInPictureWindow;
  pipWindow.addEventListener('resize', onPipWindowResize);
});

video.addEventListener('leavepictureinpicture', function(event) {
  pipWindow.removeEventListener('resize', onPipWindowResize);
});

function onPipWindowResize(event) {
    console.log(`> Window size changed to ${pipWindow.width}x${pipWindow.height}`);
}

/* Feature support */

if ('pictureInPictureEnabled' in document) {
  // Set button ability depending on whether Picture-in-Picture can be used.
  setPipButton();
  video.addEventListener('loadedmetadata', setPipButton);
  video.addEventListener('emptied', setPipButton);
} else {
  // Hide button if Picture-in-Picture is not supported.
  togglePipButton.hidden = true;
}

function setPipButton() {
  togglePipButton.disabled = (video.readyState === 0) ||
                             !document.pictureInPictureEnabled ||
                             video.disablePictureInPicture;
}


video.addEventListener('click', toggleVideoStatus);
video.addEventListener('pause', updatePlayIcon);
video.addEventListener('play', updatePlayIcon);
video.addEventListener('timeupdate', updateProgress);

play.addEventListener('click', toggleVideoStatus);
stop.addEventListener('click', stopVideo);
progress.addEventListener('change', setVideoProgress);
