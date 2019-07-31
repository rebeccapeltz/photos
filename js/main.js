// Put variables in global scope to make them available to the browser console.
const video = document.querySelector('video');
const canvas = window.canvas = document.querySelector('canvas');
let fileData;
canvas.width = 480;
canvas.height = 360;

const snapshotButton = document.querySelector('#snapshot');
// button.onclick = function() {
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

//   fileData = canvas.toDataURL('image/jpeg');
// let a = document.createElement('a');
// a.href = url;
// a.textContent = "photo"
// a.target = '_blank';
// a.download = 'photo.jpeg';
// document.querySelector('body').append(a)
// a.click();
// };
// document.addEventListener("DOMContentLoaded",event=>{
  snapshotButton.addEventListener("click", event => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    fileData = canvas.toDataURL('image/jpeg');
  })
  document.addEventListener("submit", event => {
    event.preventDefault()
    let cloudName = document.querySelector('input[name=cloud-name]').value;
    let preset = document.querySelector('input[name=preset]').value;
    if (fileData) {
      uploadFile(fileData, cloudName, preset)
    }
  })
// })


const constraints = {
  audio: false,
  video: {
    exact: 'environment'
  }
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);