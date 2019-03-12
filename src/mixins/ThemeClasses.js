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
        },

        themeHoverBgClass(){
            return 'hover-bg-' + this.themeColor
        },

        themeHoverTextClass(){
            return 'hover-text-' + this.themeColor
        },
    }
}