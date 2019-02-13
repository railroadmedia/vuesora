export default {
    props: {
        themeColor: {
            type: String,
            default: () => 'drumeo'
        }
    },
    computed: {
        themeBgClass(){
            return 'bg-' + this.themeColor
        },

        themeTextClass(){
            return 'text-' + this.themeColor
        }
    }
}