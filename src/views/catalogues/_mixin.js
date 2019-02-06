import { DateTime } from 'luxon';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';

export default {
    mixins: [UserCatalogueEvents],
    props: {
        $_item: {
            type: Object
        },

        $_themeColor: {
            type: String,
            default: () => 'drumeo'
        },

        $_brand: {
            type: String,
            default: () => 'drumeo'
        },

        $_userId: {
            type: String,
            default: () => ''
        },

        $_contentTypeOverride: {
            type: String,
            default: ''
        },

        $_forceWideThumbs: {
            type: Boolean,
            default: () => false
        },

        $_lockUnowned: {
            type: Boolean,
            default: () => false
        },

        $_useThemeColor: {
            type: Boolean,
            default: () => false
        },

        $_resetProgress: {
            type: Boolean,
            default: () => false
        },

        $_overview: {
            type: Boolean,
            default: () => false
        },

        $_index: {
            default: () => ''
        },

        $_active: {
            type: Boolean,
            default: () => false
        },

        $_displayUserInteractions: {
            type: Boolean,
            default: () => true
        },

        $_showNumbers: {
            type: Boolean,
            default: () => false
        },

        $_noLink: {
            type: Boolean,
            default: () => false
        },

        $_is_search: {
            type: Boolean,
            default: false
        },

        $_destroyOnListRemoval: {
            type: Boolean,
            default: () => false
        },

        $_compactLayout: {
            type: Boolean,
            default: () => false
        }
    },

    data(){
        return {
            model: null
        }
    },

    computed: {

        $_is_added:{
            cache: false,
            get(){
                return this.$_item.is_added_to_primary_playlist;
            }
        },

        $_thumbnail(){
            if(this.$_item.type === 'learning-path' && this.brand === 'drumeo'){
                return this.$_item['background_image_url'] ||
                    'https://dmmior4id2ysr.cloudfront.net/assets/images/drumeo_fallback_thumb.jpg'
            }

            return this.$_item['thumbnail_url'] ||
                'https://dmmior4id2ysr.cloudfront.net/assets/images/drumeo_fallback_thumb.jpg'
        },

        $_progress_percent(){
            if(this.$_item.type === 'course' ||
                this.$_item.type === 'pack' ||
                this.$_item.type === 'pack-bundle' ||
                this.$_item.type === 'semester-pack' ||
                this.$_item.type === 'learning-path'){

                return this.$_item['progress_percent'];
            }

            if(this.$_item.video != null){
                return (Number(this.$_item['last_watch_position_in_seconds']) / Number(this.$_item.video.length_in_seconds)) * 100;
            }

            return 0;
        },

        $_noAccess(){
            return (this.$_lockUnowned && this.$_item.is_owned === false) || (this.$_lockUnowned && !this.$_isReleased);
        },

        $_isReleased(){
            return DateTime.fromSQL(this.$_item['published_on']).toFormat('x') < Date.now();
        },

        $_releaseDate(){
            return DateTime.fromSQL(this.$_item['published_on']).toFormat('LLL d/yy');
        },

        $_completedIcon(){
            return this.$_item['type'] === 'course' ? 'fa-trophy' : 'fa-check-circle';
        },

        $_thumbnailIcon(){
            const contentWithHierarchy = {
                'drumeo': ['course', 'learning-path', 'pack', 'pack-bundle', 'semester-pack'],
                'guitareo': ['course', 'song', 'play-along', 'learning-path', 'pack', 'pack-bundle', 'semester-pack'],
                'pianote': ['course', 'learning-path', 'pack', 'chord-and-scale']
            };

            if(this.$_noAccess){
                if(this.$_lockUnowned && this.$_item.is_owned === false){
                    return 'fa-lock';
                }

                if(!this.$_isReleased){
                    return 'fa-clock';
                }
            }

            return contentWithHierarchy[this.$_brand].indexOf(this.$_item.type) !== -1 ? 'fa-arrow-right' : 'fa-play';
        },

        $_renderLink(){
            if(this.$_noLink){
                return false;
            }

            return this.$_noAccess;
        },

        theme(){
            if(this.$_useThemeColor){
                return this.$_themeColor
            }

            return this.$_item.type;
        },

        thumbnailType(){
            return ['song', 'chord-and-scale'].indexOf(this.$_item['type']) !== -1 && this.$_forceWideThumbs === false ? 'square' : 'widescreen' + ' ' + this.$_item['type'];
        },
    }
}