const userVideo = document.querySelector('#user-video');
const startBtn = document.querySelector('#start-btn');

const state = {
    media:null
}
const socket = io();

startBtn.addEventListener('click', e =>{
    
    const mediaRecorder = new MediaRecorder(state.media,{
        audioBitsPerSecond: 128000 ,
        videoBitsPerSecond: 2500000,
        frameRate: 25
    })

    mediaRecorder.ondataavailable = ev => {
        console.log("binary media is available",ev.data)
        socket.emit("binaryStream",ev.data)
    }

    mediaRecorder.start(25);
    
})
window.addEventListener('load',async e =>{
     const media = await navigator
     .mediaDevices
     .getUserMedia({
        audio:true,
        video:true
     });
     state.media = media;
     userVideo.srcObject = media;
})