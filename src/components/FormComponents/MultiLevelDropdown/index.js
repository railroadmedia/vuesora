import Vue from 'vue';
import MultiLevelDropdown from './MultiLevelDropdown';

export default {
    install(Vue, options) {
        Vue.component(
            MultiLevelDropdown.name,
            MultiLevelDropdown,
        );
    },
};
