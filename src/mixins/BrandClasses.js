export default {
    props: {
        brand: {
            type: String,
            default: () => 'recordeo',
        },
    },
    computed: {
        brandBgClass() {
            return `vs-bg-${this.brand}`;
        },

        brandTextClass() {
            return `vs-text-${this.brand}`;
        },
    },
};
