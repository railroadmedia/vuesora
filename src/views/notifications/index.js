import Vue from 'vue';
import NotificationsTable from './NotificationsTable';

export default {
    install(Vue, options){
        Vue.component(
            NotificationsTable.name,
            NotificationsTable
        )
    }
}