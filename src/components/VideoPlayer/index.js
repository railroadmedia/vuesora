import Vue from 'vue';
import VideoPlayer from './VideoPlayer';

export default {
    install(Vue, options){
        Vue.component(
            VideoPlayer.name,
            VideoPlayer
        )
    }
}

