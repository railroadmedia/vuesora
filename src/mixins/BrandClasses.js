export default {
    props: {
        brand: {
            type: String,
            default: () => 'recordeo'
        }
    },
    computed: {
        brandBgClass(){
            return 'bg-' + this.brand
        },

        brandTextClass(){
            return 'text-' + this.brand
        }
    }
}