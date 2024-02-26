import express from "express";
import path from "path";
import fs from 'fs'

const app = express();

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, "public/index.html");
   res.sendFile(filePath);
});


app.get("/video",(req,res)=>{
    const range= req.headers.range; 
    const videoPath="./video.mp4";
    const videoSize=fs.statSync(videoPath).size;
    const chunkSize = 1 * 1e6; // 1MB

    if(range){
      const start=Number( range && range.replace(/\D/g,""));
      const end = Math.min((start + chunkSize), videoSize - 1)
      const contentLength=end-start+1;
      const headers={
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
      }
      res.writeHead(206,headers);
      const videoStream=fs.createReadStream(videoPath,{start:start,end:end});
      videoStream.pipe(res);
    };
});



app.listen(4041, () => {
  console.log("server is running at port 4041");
});
