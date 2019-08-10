class Camera {
  constructor(videoEl, canvasEl, deviceSelectEl,galleryEl) {
    this.currentImage = null
    this.cloudName = null
    this.preset = null
    this.defaultCloudName = "picturecloud7"
    this.defaultPreset = "bp_test_1"
    this.video = videoEl
    this.canvas = canvasEl
    this.select = deviceSelectEl
    this.gallery = galleryEl
    this.fileData = null
    this.constraints = null
  }
  setCloudName(cloudName) {
    this.cloudName = cloudName
  }
  setPreset(preset) {
    this.preset = preset
  }

  setConstraints() {
    console.log("set constraints")
    const videoConstraints = {};
    if (this.select.value === '') {
      videoConstraints.facingMode = 'environment';
    } else {
      videoConstraints.deviceId = {
        exact: select.value
      };
    }
    this.constraints = {
      video: videoConstraints,
      audio: false
    };
  }

  turnOnDevice() {
    console.log("camera on")
    this.turnAllDevicesOff()
    this.setConstraints()

    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then(stream => {
        window.stream = stream;
        this.video.srcObject = stream;
        return navigator.mediaDevices.enumerateDevices();
      })
      .then(mediaDevices => {
        this.select.innerHTML = '';
        this.select.appendChild(document.createElement('option'));
        let count = 1;
        mediaDevices.forEach(mediaDevice => {
          if (mediaDevice.kind === 'videoinput') {
            const option = document.createElement('option');
            option.value = mediaDevice.deviceId;
            const label = mediaDevice.label || `Camera ${count++}`;
            const textNode = document.createTextNode(label);
            option.appendChild(textNode);
            select.appendChild(option);
          }
        })
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  turnAllDevicesOff(video) {
    console.log("camera off")
    // video.pause()
    if (window.stream) {
      window.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
  }
  snapshot() {
    console.log("snapshot")
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    this.fileData = this.canvas.toDataURL('image/jpeg');
  }
  download() {
    if (this.fileData) {
      console.log("download")
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      let a = document.createElement('a');
      a.href = this.fileData;
      a.textContent = "photo"
      a.target = '_blank'
      a.download = 'photo.jpeg'
      document.querySelector('body').append(a)
      a.click()
    }
  }
  upload() {
    console.log("upload")
    let url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.onreadystatechange = event =>{
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        var response = JSON.parse(xhr.responseText);
        // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg

        // https://res.cloudinary.com/picturecloud7/image/upload/v1564440707/bp_test/kosncafik1qzdckwgbbe.jpg

        var url = response.secure_url;
        // Create a thumbnail of the uploaded image, with 150px width
        var tokens = url.split('/');
        // insert 3rd from the last element
        tokens.splice(-3, 0, 'w_150,c_scale');
        var img = new Image(); // HTML5 Constructor
        img.src = tokens.join('/');
        img.alt = response.public_id;
        this.gallery.appendChild(img);
      }
    };

    fd.append('upload_preset', this.preset);
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', this.fileData)
    xhr.send(fd);
  }
}