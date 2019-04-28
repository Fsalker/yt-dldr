exports.supplyVideos = async() => {
    try{
        // Require
        let fetch = require("node-fetch")
        const {SUPPLY_FOLDER, YT_FINAL_RESULTS, MAX_VIDEO_DURATION, SEARCH_VALUES} = require("./config.js")
        const {getDurationFromIsoDuration, writeToFile} = require("./utils.js")
        const {YT_API_KEY} = require("../env.js")

        const YT_NUM_EXTRA_RESULTS = parseInt(YT_FINAL_RESULTS * 2)  // We only want the videos, so we need to fetch a little more links in order to skip channels and other useless reults such as channels (:
        const YT_NUM_RESULTS = YT_FINAL_RESULTS + YT_NUM_EXTRA_RESULTS 

        let results = []
        for(searchValue of SEARCH_VALUES){
            console.log(`Supplying ${searchValue}`)
            let videosData = await (await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&part=snippet&maxResults=${YT_NUM_RESULTS}&q=${searchValue}`)).json()
            if(videosData.error)
                throw videosData.error
            videosData.items = videosData.items.filter(video => video.id.kind === "youtube#video") // Keep videos only

                // Filter out videos longer than our desired maximum duration
            let videosIdsString = videosData.items.map(video => video.id.videoId).join(",")
            let videosInfo = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${YT_API_KEY}&part=contentDetails&id=${videosIdsString}`)).json()
            let videosDurations = []
            videosInfo.items.forEach(info => videosDurations[info.id] = getDurationFromIsoDuration(info.contentDetails.duration))
            videosData.items = videosData.items.filter(video => {
                console.log(`Video ID = ${video.id.videoId}, Duration = ${videosDurations[video.id.videoId]}, Keeping ---> ${videosDurations[video.id.videoId] < MAX_VIDEO_DURATION}`)
                return videosDurations[video.id.videoId] < MAX_VIDEO_DURATION
            })
            videosData.items = videosData.items.slice(0, YT_FINAL_RESULTS) // Keep our desired amount of videos

                // Fuck, we should've fetched more vids
            if(videosData.items.length < YT_FINAL_RESULTS)
                console.log(`Warning: only ${videosData.items.length} videos could be fetched. Something stinks here!`)

            results.push({
                searchValue,
                items: videosData.items.map(item => ({url: `https://www.youtube.com?v=${item.id.videoId}`, title: item.snippet.title, description: item.snippet.description}))
            })
        }

        let fs = require("fs")
        if(!fs.existsSync(SUPPLY_FOLDER))
            fs.mkdirSync(SUPPLY_FOLDER)
        await writeToFile(`${SUPPLY_FOLDER}/videos`, JSON.stringify(results, null, 4), "js")
        console.log(`Succesfully written the videos in ${SUPPLY_FOLDER}`)
    }catch(e){
        console.log(e)
    }
}