module.exports = {
    getDurationFromIsoDuration: (duration_iso) => { // Because youtube gives us complicated timestamps for video durations
        duration_arr = duration_iso.split(/[A-Z]/g).filter(x => x != "").reverse()
        duration_multipliers = [1, 60, 60*24] // seconds, minutes, hours
        duration_arr_seconds = duration_arr.map((val, index) => val * duration_multipliers[index])
        duration = duration_arr_seconds.reduce((elem, reducer) => reducer + elem, 0)
        return duration
    },
    writeToFile: async(fileName, contentString, extension = "txt") => {
        let fs = require("fs").promises
        await fs.writeFile(`${fileName}_${new Date().getTime()}.${extension}`, contentString)
    },
}