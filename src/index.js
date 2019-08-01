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
    },
};
