import Vue from 'vue';
import ForumThread from './ForumThread';

export default {
    install(Vue, options){
        Vue.component(
            ForumThread.name,
            ForumThread
        )
    }
}