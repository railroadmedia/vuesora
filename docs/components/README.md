# Components

## Video Player
<ClientOnly>
<VideoPlayer 
    theme-color="drumeo"
    poster="https://i.vimeocdn.com/video/793611974.jpg"
    hls-manifest-url="https://player.vimeo.com/external/344197872.m3u8?s=0ae01be5ccea6163bc62299ddfcd6b4a3c2b8198"
    cast-title="Vuesora Video Player">
</VideoPlayer>
</ClientOnly>

### Props

| Prop             | Type     | Default      | Description
|------------------|----------|--------------|---------------
| `brand`          | String   | 'drumeo'     | The current applications brand name
| `hlsManifestUrl` | String   | _null_       | The HLS manifest to serve the player
| `poster`         | String   | _null_       | The poster to display when the player has no progress
| `chapters`       | Array    | []           | Array of numbers that represent times in seconds
| `currentSecond`  | Number   | 0            | The current second to start the player at
| `isLiked`        | Boolean  | false        | Has the current user liked this video
| `likeCount`      | Number   | 0            | Total number of users that have liked the video
| `contentId`      | String   | _null_       | The database ID of the content
| `userId`         | String   | _null_       | The database ID of the current user
| `videoId`        | String   | _null_       | The database ID of the video
| `progressState`  | String   | 'unstarted'  | The progress state of the current content for the current user
| `castTitle`      | String   | ''           | The title to display on google chromecast

### Events

| Event            | Description
|------------------|---------------
| `canplaythrough` | Fired when the user agent can play the media, and estimates that enough data has been loaded to play the media up to its end without having to stop for further buffering of content.
| `loadedmetadata` | Fired when the metadata has been loaded
| `durationchange` | Fired when the duration attribute has been updated.
| `waiting`        | Fired when playback has stopped because of a temporary lack of data
| `pause`          | Fired when a request to pause play is handled and the activity has entered its paused state, most commonly occurring when the media's HTMLMediaElement.pause() method is called.
| `play`           | Fired when when the paused property is changed from true to false, as a result of the HTMLMediaElement.play() method, or the autoplay attribute
| `playing`        | Fired when playback is ready to start after having been paused or delayed due to lack of data
| `timeupdate`     | Fired when the time indicated by the currentTime attribute has been updated
| `cc-time`        | Fired when Chromecast's currentTime attribute has been updated
| `cc-playpause`   | Fired when Chromecast's isPausedChanged attribute has been updated
| `cc-media`       | Fired when Chromecast's media is updated and has been downloaded
| `cc-disconnect`  | Fired when Chromecast's session has been disconnected
| `cc-state`       | Fired when Chromecast's playerState attribute has been updated

### Errors

You can view all error codes and descriptions here:

[Shaka Errors](https://shaka-player-demo.appspot.com/docs/api/shaka.util.Error.html)