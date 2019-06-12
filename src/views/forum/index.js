import Vue from 'vue';
import ForumThreadsTable from './ForumThreadsTable';

export default {
    install(Vue, options){
        Vue.component(
            ForumThreadsTable.name,
            ForumThreadsTable
        )
    }
}