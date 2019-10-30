import Utils from '@musora/helper-functions/modules/utils';

export default {
    props: {
        contentType: {
            type: String,
            default: () => 'drumeo',
        },

        themeColor: {
            type: String,
            default: () => 'drumeo',
        },

        useThemeColor: {
            type: Boolean,
            default: () => true,
        },
    },
    computed: {
        themeBgClass() {
            if (this.useThemeColor) {
                return `bg-${this.themeColor}`;
            }

            const type = Utils.getThemeColorByContentType(this.contentType);

            return `bg-${type}`;
        },

        themeTextClass() {
            if (this.useThemeColor) {
                return `text-${this.themeColor}`;
            }

            const type = Utils.getThemeColorByContentType(this.contentType);

            return `text-${type}`;
        },

        themeHoverBgClass() {
            if (this.useThemeColor) {
                return `hover-bg-${this.themeColor}`;
            }

            const type = Utils.getThemeColorByContentType(this.contentType);

            return `hover-bg-${type}`;
        },

        themeHoverTextClass() {
            if (this.useThemeColor) {
                return `hover-text-${this.themeColor}`;
            }

            const type = Utils.getThemeColorByContentType(this.contentType);

            return `hover-text-${type}`;
        },
    },
};
