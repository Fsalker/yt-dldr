exports.downloadVideos = async() => {
    try{
        let path = require("path")
        let fs = require("fs").promises
        let fs_original = require("fs")
        let {FFMPEG_PATH} = require("../env.js")
        let {SUPPLY_FOLDER, DOWNLOADS_FOLDER} = require("./config.js")

        
        // Get the videos information (url, title, ...) from the most recent video list file
        // console.log(await fs.readdir(SUPPLY_FOLDER)).filter(file => file.match(/videos[\.0-9]{0,}\.js/))
        const VIDEO_FILES = await fs.readdir(SUPPLY_FOLDER)
        if(!VIDEO_FILES)
            throw "You must supply the videos before downloading them!"
        const MOST_RECENT_VIDEO_FILE = VIDEO_FILES.filter(file => file.match(/videos_[0-9]{0,}\.js/)).sort((a, b) => a>b ? -1 : 1)[0]
        let videos = JSON.parse((await fs.readFile(`${SUPPLY_FOLDER}/${MOST_RECENT_VIDEO_FILE}`)).toString())

        // Create a new entry in the Downloads folder
        const OUTPUT_DIR = path.join(DOWNLOADS_FOLDER, new Date().getTime().toString())
        if(!fs_original.existsSync(OUTPUT_DIR))
            fs_original.mkdirSync(OUTPUT_DIR)

        // Set up this very handy tool (:
        let YoutubeMp3Downloader = require("youtube-mp3-downloader")
        let YD = new YoutubeMp3Downloader({
            "ffmpegPath": FFMPEG_PATH,       
            "outputPath": OUTPUT_DIR,    
            "youtubeVideoQuality": "highest",
            "queueParallelism": 1,           
            "progressTimeout": 1000,
        });

        // Let's go!
        let videoIds = []
        for(let video of videos)
            for(let item of video.items)
                videoIds.push(item.url.split("=")[1])
                // let entities = new (require("html-entities").XmlEntities)() // Convert those HTML encoded characters to actual letters
                // let title = entities.decode(item.title).replace(/"/g, `'`).replace(/[\\\/:\?\*"<>\|]/g)
        let count = 0
        for(let id of videoIds){
            YD.download(id)
            // setTimeout(() => YD.download(id), 7000 * count)
            // ++count
            // if(count >=)
        }
        console.log("Now downloading... This might take a while.")
        YD.on("error", e => {
            console.log(e)
            console.log("An error has occurred above here: ^^^^^^^^^^^^^")
        })
        YD.on("progress", function(progress) {
            console.log(JSON.stringify(progress));
        });
    } catch(e){console.trace(e)}
}