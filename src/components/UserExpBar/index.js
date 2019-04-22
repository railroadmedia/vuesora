import Vue from 'vue';
import UserExpBar from './UserExpBar';

export default {
    install(Vue, options){
        Vue.component(
            UserExpBar.name,
            UserExpBar
        )
    }
}