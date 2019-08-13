const select = document.querySelector("#video-select")
const downloadBtn = document.querySelector("#download")
const stopBtn = document.querySelector("#stop-stream")
const startBtn = document.querySelector("#start-stream")

const snapshotBtn = document.querySelector("#snapshot")
const gallery = document.querySelector("#gallery")
const video = document.querySelector("video")
const canvas = document.querySelector("canvas")

const camera = new Camera(video, canvas, select,gallery)
// camera.turnOnDevice()

startBtn.addEventListener("click",event=>{
  camera.turnOnDevice()
})
snapshotBtn.addEventListener("click",event=>{
  camera.snapshot()
})

downloadBtn.addEventListener("click", event=>{
  camera.download()
})

stopBtn.addEventListener("click", event=>{
  camera.turnAllDevicesOff()
} )

select.addEventListener("change", event=>{
  camera.turnOnDevice()
})

document.addEventListener("submit", event => {
  event.preventDefault()
  let cloudName = document.querySelector('input[name=cloud-name]').value;
  let preset = document.querySelector('input[name=preset]').value;
  if (cloudName) camera.setCloudName(cloudName)
  if (preset) camera.setPreset(preset)
  camera.upload()
})