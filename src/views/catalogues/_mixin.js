import { DateTime } from 'luxon';
import { Content as ContentHelpers } from '@musora/helper-functions';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';
import ContentModel from '../../assets/js/models/_model.js';

export default {
    mixins: [UserCatalogueEvents],
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },

        brand: {
            type: String,
            default: () => 'drumeo',
        },

        userId: {
            type: String,
            default: () => '',
        },

        isAdmin: {
            type: Boolean,
            default: () => false,
        },

        contentTypeOverride: {
            type: String,
            default: '',
        },

        forceWideThumbs: {
            type: Boolean,
            default: () => false,
        },

        lockUnowned: {
            type: Boolean,
            default: () => false,
        },

        resetProgress: {
            type: Boolean,
            default: () => false,
        },

        overview: {
            type: Boolean,
            default: () => false,
        },

        index: {
            type: [Number, String],
            default: () => '',
        },

        active: {
            type: Boolean,
            default: () => false,
        },

        displayUserInteractions: {
            type: Boolean,
            default: () => true,
        },

        showNumbers: {
            type: Boolean,
            default: () => false,
        },

        noLink: {
            type: Boolean,
            default: () => false,
        },

        is_search: {
            type: Boolean,
            default: false,
        },

        destroyOnListRemoval: {
            type: Boolean,
            default: () => false,
        },

        compactLayout: {
            type: Boolean,
            default: () => false,
        },
    },

    data() {
        return {
            contentModel: this.getContentModel(),
        };
    },

    computed: {

        is_added: {
            cache: false,
            get() {
                return this.item.is_added_to_primary_playlist;
            },
        },

        progress_percent() {
            return this.item.progress_percent;
        },

        noAccess() {
            if (this.isAdmin) {
                return false;
            }

            return (this.lockUnowned && this.item.is_owned === false) || (this.lockUnowned && !this.isReleased);
        },

        datePublshedOn() {
            return DateTime.fromSQL(this.item.published_on, { zone: 'UTC' }).toFormat('x');
        },

        dateNow() {
            return Date.now();
        },

        isReleased() {
            if (this.isAdmin) {
                return true;
            }

            return this.dateNow > this.datePublshedOn;
        },

        releaseDate() {
            return DateTime.fromSQL(this.item.published_on).toFormat('LLL d/yy');
        },

        completedIcon() {
            return this.item.type === 'course' ? 'fa-trophy' : 'fa-check-circle';
        },

        thumbnailIcon() {
            const contentWithHierarchy = {
                drumeo: ['course', 'learning-path', 'learning-path-level', 'learning-path-course', 'pack',
                    'pack-bundle', 'semester-pack'],
                guitareo: ['course', 'song', 'play-along', 'learning-path', 'pack', 'pack-bundle', 'semester-pack'],
                pianote: ['course', 'learning-path', 'pack', 'chord-and-scale'],
                singeo: ['course', 'learning-path', 'pack', 'chord-and-scale'], // todo - update
            };

            if (this.noAccess) {
                if (this.lockUnowned && this.item.is_owned === false) {
                    return 'fa-lock';
                }

                if (!this.isReleased) {
                    return 'fa-clock';
                }
            }

            if (this.item.completed) {
                return this.completedIcon;
            }

            return contentWithHierarchy[this.brand].indexOf(this.item.type) !== -1 ? 'fa-arrow-right' : 'fa-play';
        },

        renderLink() {
            if (this.noLink) {
                return false;
            }

            return !this.noAccess;
        },

        thumbnailType() {
            if (this.forceWideThumbs) {
                return 'widescreen';
            }

            return {
                drumeo: ['song', 'learning-path-level'],
                guitareo: ['song', 'chord-and-scale'],
                pianote: ['song', 'unit', 'learning-path-level'],
                singeo: ['song', 'unit', 'learning-path-level'], // todo - update
            }[this.brand].indexOf(this.item.type) !== -1 ? 'square' : 'widescreen';
        },
    },

    methods: {

        getContentModel() {
            const shows = ContentHelpers.shows();
            let type = this.contentTypeOverride || this.item.type;

            if (shows.indexOf(type) !== -1) {
                type = 'show';
            }

            return new ContentModel(type, {
                brand: this.brand,
                post: this.item,
            });
        },
    },
};
