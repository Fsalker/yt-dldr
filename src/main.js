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