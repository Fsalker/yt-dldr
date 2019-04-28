# Yt-dldr

I needed a way to supply songs for my personal use, so I've written this cool app.

# How to use

1. `npm i` to install the dependencies
2. fill in `env_example.js` with the appropriate [Youtube API key](https://developers.google.com/youtube/) and [FFMPEG's path](https://www.ffmpeg.org/download.html)
3. configure the app to suit your needs by editing `src/config.js`. Most notably, you would probably like to adjust `SEARCH_VALUES` and `YT_FINAL_RESULTS` to your desired search filters (which is exactly the text you insert on youtube when you would normally search for videos) and the final amount of videos you'd like to download
4. `npm run supply-videos-list`
5. `npm run download-videos`
6. 

# Known bugs
You cannot download videos that contain character | in their title (and probably all the other illegal file characters in Windows too \/:*?"<>). Yeah, I know, it sucks. If you find a way to make FFMPEG work with them you'll win two beers from me. And a mention on this famous repository, of course!

# License

Fuck licenses, this app is illegal anyway as it's against Youtube's ToS. If anyone asks, you didn't get it from me. Feel free to contribute to it, make $$$ out of it, brag to your friends about it and whatever else you could possibly wish to do with it.