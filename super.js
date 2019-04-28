/*
        How to use this wonderful application :D

    1. Create ./downloads and ./videos_list, if needed (the code might throw an error if they don't exist. haven't tested it yet)
    2. Fill the "searchValues" array below with your relevant search fields that you'd like to find on Youtube
    3. Run "node super.js get-videos" to download those videos' information (essentially their URL and TITLE)
    4. Run "node super.js download-videos" to download them as mp3 files
    5. Enjoy!

*/

(async() => {
    try{
        // Config
        const SUPPLY_FOLDER = "./videos_list"
        const DOWNLOADS_FOLDER = "./downloads"
        const YT_FINAL_RESULTS = 8
        const MAX_VIDEO_DURATION = 15*60 // 15 minutes = 900 seconds

        let getYoutubeVideos = async() => {
            // Require
            let fetch = require("node-fetch")

            let searchValues = [
                // "manele",
                // "dubstep",
                // "dnb",
                // "big room house",
                "skrillex",
                "flux pavilion",

                "angerfist",
                "s3rl",

                "macky gee",
                "netsky",
                "pendulum",
                "hybrid minds",
                "noisia",
                "state of mind",

                "dmitry vegas",
                "don diablo",
                "borgeous",
                "tujamo",

                "boris brejcha",

                "florin salam",
                "guta",
                "dani mocanu",
            ]

            // Initialise
            const YT_API_KEY = "AIzaSyCcxbyBR05Z87_X9T-Wf7XAzrgsM2RX0_k"
            const YT_NUM_EXTRA_RESULTS = 10 // We only want the videos, so we need to fetch a little more links in order to skip channels and other useless reults such as channels (:
            const YT_NUM_RESULTS = YT_FINAL_RESULTS + YT_NUM_EXTRA_RESULTS 

            let getDurationFromIsoDuration = (duration_iso) => {
                duration_arr = duration_iso.split(/[A-Z]/g).filter(x => x != "").reverse()
                duration_multipliers = [1, 60, 60*24] // seconds, minutes, hours
                duration_arr_seconds = duration_arr.map((val, index) => val * duration_multipliers[index])
                duration = duration_arr_seconds.reduce((elem, reducer) => reducer + elem, 0)
                return duration
            }

            let results = []
            for(searchValue of searchValues){
                console.log(`Supplying ${searchValue}`)
                let videosData = await (await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&part=snippet&maxResults=${YT_NUM_RESULTS}&q=${searchValue}`)).json()
                videosData.items = videosData.items.filter(video => video.id.kind === "youtube#video") // Keep videos only

                let videosIdsString = videosData.items.map(video => video.id.videoId).join(",")
                let videosInfo = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${YT_API_KEY}&part=contentDetails&id=${videosIdsString}`)).json()
                let videosDurations = []
                videosInfo.items.forEach(info => videosDurations[info.id] = getDurationFromIsoDuration(info.contentDetails.duration))
                videosData.items = videosData.items.filter(video => {
                    console.log(`Video ID = ${video.id.videoId}, Duration = ${videosDurations[video.id.videoId]}, Keeping ---> ${videosDurations[video.id.videoId] < MAX_VIDEO_DURATION}`)
                    return videosDurations[video.id.videoId] < MAX_VIDEO_DURATION
                })
                videosData.items = videosData.items.slice(0, YT_FINAL_RESULTS) // Keep our desired amount of videos

                if(videosData.items.length < YT_FINAL_RESULTS)
                    console.log(`Warning: only ${videosData.items.length} videos could be fetched. Something stinks here!`)
                results.push({
                    searchValue,
                    items: videosData.items.map(item => ({url: `https://www.youtube.com?v=${item.id.videoId}`, title: item.snippet.title, description: item.snippet.description}))
                })
            }

            await writeToFile(`${SUPPLY_FOLDER}/videos`, JSON.stringify(results, null, 4))
            console.log(`Succesfully written the videos in ${SUPPLY_FOLDER}`)
        }

        let writeToFile = async(fileName, contentString, extension = "txt") => {
            let fs = require("fs").promises
            await fs.writeFile(`${fileName}_${new Date().getTime()}.${extension}`, contentString)
        }

        let downloadVideos = async() => {
            try{
                let fs = require("fs").promises
                let fs_original = require("fs")
                
                // Get the videos information (url, title, ...) from the most recent video list file
                const MOST_RECENT_VIDEO_FILE = (await fs.readdir(SUPPLY_FOLDER)).filter(file => file.match(/videos.{0,}/)).sort((a, b) => a>b ? -1 : 1)[0]
                let videos = (await fs.readFile(`${SUPPLY_FOLDER}/${MOST_RECENT_VIDEO_FILE}`)).toString()
                let videosJson = JSON.parse(videos)
                // videosJson.map(video => {
                //     let newVideo = video
                //     newVideo.items = newVideo.items.filter(item => !item.url.match(/v=undefined/))
                //     return newVideo
                // }) // Filter out anything that's not a video

                // Create a new entry in the Downloads folder
                let date = new Date().getTime()
                let outputDir = `${__dirname}/downloads/${date}`
                fs_original.mkdirSync(outputDir)

                // Configure this very handy tool (:
                let YoutubeMp3Downloader = require("youtube-mp3-downloader")
                let YD = new YoutubeMp3Downloader({
                    "ffmpegPath": `C:\\Users\\Andrei\\Desktop\\interesting programs\\ffmpeg-20190420-3a07aec-win64-static\\bin\\ffmpeg.exe`,        // Where is the FFmpeg binary located?
                    "outputPath": outputDir,    // Where should the downloaded and encoded files be stored?
                    "youtubeVideoQuality": "highest",       // What video quality should be used?
                    "queueParallelism": 1,                  // How many parallel downloads/encodes should be started?
                    "progressTimeout": 2000                 // How long should be the interval of the progress reports
                });

                // Let's go!
                videosJson = videosJson
                let videoIds = []
                for(let video of videosJson)
                    for(let item of video.items)
                        videoIds.push(item.url.split("=")[1])
                        // let entities = new (require("html-entities").XmlEntities)() // Convert those HTML encoded characters to actual letters
                        // let title = entities.decode(item.title).replace(/"/g, `'`).replace(/[\\\/:\?\*"<>\|]/g)
                let count = 0
                for(let id of videoIds){
                    setTimeout(() => YD.download(id), 7000 * count)
                    ++count
                }
                console.log("Now downloading... This might take a while.")
                YD.on("error", e => {
                    console.log(e)
                    console.log("!!!")
                })
                YD.on("progress", function(progress) {
                    console.log(JSON.stringify(progress));
                });
            } catch(e){ console.log(e) }
        }
 
        console.clear()
        let command = process.argv[2]
        switch(command){
            case "supply":
                await getYoutubeVideos()
                break;
            case "download":
                await downloadVideos()
                break;  
            default:
                throw "Please insert an available command! (supply, download)"
        }
    }catch(e){
        console.log(e)
    }
})()