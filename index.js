import http from "http";
import express from "express";
import path from "path";
import {Server as SocketIo} from "socket.io";
import { spawn } from "child_process";


const PORT = 3000;
const app = express();
app.use(express.static(path.resolve("./public")));

const options = [
    '-i',
    '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `${25}`,
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', 128000 / 4,
    '-f', 'flv',
    `rtmp://a.rtmp.youtube.com/live2/dcfx-m7v2-j248-3185-9207`,
];

const ffmpegProcess = spawn('ffmpeg', options);

const server = http.createServer(app);
const io = new SocketIo(server);

io.on("connection",socket => {
    console.log("socket connected",socket.id);
    socket.on("binaryStream",(data)=>{
        console.log("binary stream is coming",data)
        ffmpegProcess.stdin.write(data,(err)=>{
            console.log("err",err)
        })
    })
})

ffmpegProcess.stdout.on('data', (data) => {
    console.log(`ffmpeg stdout: ${data}`);
});

ffmpegProcess.stderr.on('data', (data) => {
    console.error(`ffmpeg stderr: ${data}`);
});

ffmpegProcess.on('close', (code) => {
    console.log(`ffmpeg process exited with code ${code}`);
});


server.listen(PORT,()=> console.log("server is running on ",PORT));