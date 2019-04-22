import Vue from 'vue';
import TextEditor from './TextEditor';

export default {
    install(Vue, options){
        Vue.component(
            TextEditor.name,
            TextEditor
        )
    }
}