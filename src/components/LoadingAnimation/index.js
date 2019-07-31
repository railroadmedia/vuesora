import LoadingAnimation from './LoadingAnimation';

export default {
    install(Vue, options) {
        Vue.component(
            LoadingAnimation.name,
            LoadingAnimation,
        );
    },
};
