import Vue from 'vue';
import Schedule from './Schedule';

export default {
    install(Vue, options){
        Vue.component(
            Schedule.name,
            Schedule
        )
    }
}