import { DateTime } from 'luxon';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';

export default {
    mixins: [UserCatalogueEvents],
    props: {
        item: {
            type: Object
        },

        brand: {
            type: String,
            default: () => 'drumeo'
        },

        userId: {
            type: String,
            default: () => ''
        },

        contentTypeOverride: {
            type: String,
            default: ''
        },

        forceWideThumbs: {
            type: Boolean,
            default: () => false
        },

        lockUnowned: {
            type: Boolean,
            default: () => false
        },

        resetProgress: {
            type: Boolean,
            default: () => false
        },

        overview: {
            type: Boolean,
            default: () => false
        },

        index: {
            default: () => ''
        },

        active: {
            type: Boolean,
            default: () => false
        },

        displayUserInteractions: {
            type: Boolean,
            default: () => true
        },

        showNumbers: {
            type: Boolean,
            default: () => false
        },

        noLink: {
            type: Boolean,
            default: () => false
        },

        is_search: {
            type: Boolean,
            default: false
        },

        destroyOnListRemoval: {
            type: Boolean,
            default: () => false
        },

        compactLayout: {
            type: Boolean,
            default: () => false
        }
    },

    computed: {

        is_added:{
            cache: false,
            get(){
                return this.item.is_added_to_primary_playlist;
            }
        },

        progress_percent(){
            if(this.item.type === 'course' ||
                this.item.type === 'pack' ||
                this.item.type === 'pack-bundle' ||
                this.item.type === 'semester-pack' ||
                this.item.type === 'learning-path'){

                return this.item['progress_percent'];
            }

            if(this.item.video != null){
                return (Number(this.item['last_watch_position_in_seconds']) / Number(this.item.video.length_in_seconds)) * 100;
            }

            return 0;
        },

        noAccess(){
            return (this.lockUnowned && this.item.is_owned === false) || (this.lockUnowned && !this.isReleased);
        },

        datePublshedOn(){
            return DateTime.fromSQL(this.item['published_on'], {zone: "UTC"}).toFormat('x');
        },

        dateNow(){
            return Date.now();
        },

        isReleased(){
            return this.dateNow > this.datePublshedOn;
        },

        releaseDate(){
            return DateTime.fromSQL(this.item['published_on']).toFormat('LLL d/yy');
        },

        completedIcon(){
            return this.item['type'] === 'course' ? 'fa-trophy' : 'fa-check-circle';
        },

        thumbnailIcon(){
            const contentWithHierarchy = {
                'drumeo': ['course', 'learning-path', 'pack', 'pack-bundle', 'semester-pack'],
                'guitareo': ['course', 'song', 'play-along', 'learning-path', 'pack', 'pack-bundle', 'semester-pack'],
                'pianote': ['course', 'learning-path', 'pack', 'chord-and-scale']
            };

            if(this.noAccess){
                if(this.lockUnowned && this.item.is_owned === false){
                    return 'fa-lock';
                }

                if(!this.isReleased){
                    return 'fa-clock';
                }
            }

            return contentWithHierarchy[this.brand].indexOf(this.item.type) !== -1 ? 'fa-arrow-right' : 'fa-play';
        },

        renderLink(){
            if(this.noLink){
                return false;
            }

            return this.noAccess;
        },

        thumbnailType(){
            if(this.forceWideThumbs){
                return 'widescreen';
            }
            else {
                return {
                    'drumeo': ['song'],
                    'guitareo': ['song', 'chord-and-scale'],
                    'pianote': ['song']
                }[this.brand].indexOf(this.item.type) !== -1 ? 'square' : 'widescreen';
            }
        },
    }
}