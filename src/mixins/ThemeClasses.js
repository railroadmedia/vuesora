export default {
    props: {
        contentType: {
            type: String,
            default: () => 'drumeo'
        },

        themeColor: {
            type: String,
            default: () => 'drumeo'
        },

        useThemeColor: {
            type: Boolean,
            default: () => true
        },
    },
    computed: {
        themeBgClass(){
            if(this.useThemeColor){
                return 'bg-' + this.themeColor
            }

            return 'bg-' + this.contentType;
        },

        themeTextClass(){
            if(this.useThemeColor) {
                return 'text-' + this.themeColor
            }

            return 'text-' + this.contentType;
        }
    }
}