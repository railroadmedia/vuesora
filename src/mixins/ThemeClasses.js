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
                return `vs-bg-${this.themeColor}`;
            }

            const type = Utils.getThemeColorByContentType(this.contentType);

            return `vs-bg-${type}`;
        },

        themeTextClass() {
            if (this.useThemeColor) {
                return `vs-text-${this.themeColor}`;
            }

            const type = Utils.getThemeColorByContentType(this.contentType);

            return `vs-text-${type}`;
        },

        themeHoverBgClass() {
            if (this.useThemeColor) {
                return `vs-hover-bg-${this.themeColor}`;
            }

            const type = Utils.getThemeColorByContentType(this.contentType);

            return `vs-hover-bg-${type}`;
        },

        themeHoverTextClass() {
            if (this.useThemeColor) {
                return `vs-hover-text-${this.themeColor}`;
            }

            const type = Utils.getThemeColorByContentType(this.contentType);

            return `vs-hover-text-${type}`;
        },
    },
};
