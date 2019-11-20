import VueLazyload from 'vue-lazyload';
import Components from './components';

export default {
    install(Vue, options) {
        Object.keys(Components)
            .forEach((name) => {
                Vue.component(
                    name,
                    Components[name],
                );
            });

        Vue.use(VueLazyload, {
            observer: true,
            observerOptions: {
                rootMargin: '100px',
                threshold: 0,
            },
            loading: false,
        });
    },
};
