(async() => {
    try{
        // console.clear()
        let {supplyVideos} = require("./supply.js")
        let {downloadVideos} = require("./download.js")

        if(process.argv[2] === "supply") await supplyVideos()
        else if(process.argv[2] === "supply-bulk") await supplyVideos(true)
        else if(process.argv[2] === "download") await downloadVideos()
        else throw "Please insert an available command! (supply, supply-bulk, download)"

        // if(process.argv[3] == "download")
        //     await downloadVideos
    }catch(e){
        console.trace(e)
    }
})()