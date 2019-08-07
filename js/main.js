// Put variables in global scope to make them available to the browser console.
const video = document.querySelector('video');
const canvas = window.canvas = document.querySelector('canvas');
const videoSelect = document.querySelector('#video-select')
let localMediaStream = null;
let fileData;
canvas.width = 480;
canvas.height = 360;

const downloadbutton = document.querySelector('#download');
downloadbutton.addEventListener("click", event => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  fileData = canvas.toDataURL('image/jpeg');
  let a = document.createElement('a');
  a.href = fileData;
  a.textContent = "photo"
  a.target = '_blank'
  a.download = 'photo.jpeg'
  document.querySelector('body').append(a)
  a.click()
})



const snapshotButton = document.querySelector('#snapshot');
snapshotButton.addEventListener("click", event => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  fileData = canvas.toDataURL('image/jpeg');
})
const stopStreamButton = document.querySelector('#stop-stream');
stopStreamButton.addEventListener("click",event=>{
  video.pause()
  // localMediaStream.stop()
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
    facingMode: 'environment'
  }
};

function handleSuccess(stream) {
  localMediaStream = stream
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
  navigator.mediaDevices.enumerateDevices().then(deviceInfos=>{
    window.deviceInfos = deviceInfos; // make available to console
    console.log('Available input and output devices:', deviceInfos);
    for (const deviceInfo of deviceInfos) {
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
        videoSelect.appendChild(option);
      }
    }
  })
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then(stream=>{
  handleSuccess(stream)
}).catch(error =>{
  handleError(error)
});

  
