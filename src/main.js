/*
        How to use this wonderful application :D

    1. Create ./downloads and ./videos_list, if needed (the code might throw an error if they don't exist. haven't tested it yet)
    2. Fill the "searchValues" array below with your relevant search fields that you'd like to find on Youtube
    3. Run "node super.js get-videos" to download those videos' information (essentially their URL and TITLE)
    4. Run "node super.js download-videos" to download them as mp3 files
    5. Enjoy!

*/

console.clear()
let {supplyVideos} = require("./supply.js")
let {downloadVideos} = require("./download.js")
let command = process.argv[2]
switch(command){
    case "supply":
        supplyVideos()
        break;
    case "download":
        downloadVideos()
        break;  
    default:
        throw "Please insert an available command! (supply, download)"
}
return