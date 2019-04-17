import Vue from 'vue';
import Comments from './Comments';

export default {
    install(Vue, options){
        Vue.component(
            Comments.name,
            Comments
        )
    }
}