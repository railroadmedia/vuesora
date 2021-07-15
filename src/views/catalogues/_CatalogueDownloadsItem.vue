<template>
    <div
        class="downloads-item flex flex-row bb-grey-1-1 no-decoration hover-bg-grey-7 relative text-grey-3 hover-text-black pv-1"
    >
        <!-- THUMBNAIL COLUMN -->
        <div
            class="flex flex-column align-v-center downloads-item-thumb"
            :class="[themeColor]"
        >
            <div class="thumb-wrap corners-10">
                <div
                    class="thumb-img corners-10 square"
                >
                    <img
                        src="https://dmmior4id2ysr.cloudfront.net/assets/images/image-loader.svg"
                        :data-ix-src="mappedData.thumbnail"
                        data-ix-fade
                        alt="Lesson Thumbnail"
                    >
                    </span>
                </div>
            </div>
        </div>

        <div class="item-details flex flex-row pl-2">
            <!-- ARTIST & SONGS -->
            <div
                class="flex flex-column align-v-center title-column overflow"
            >
                <h3
                    class="item-artist font-regular uppercase"
                    :class="[themeTextClass]"
                >{{ contentModel.artist }}</h3>
                <h3
                    class="item-title font-bold text-black"
                >{{ contentModel.title }}</h3>
            </div>

            <div class="item-actions flex flex-row align-h-right">
                <!-- DOWNLOADS -->
                <div
                    class="item-action flex flex-column uppercase align-center basic-col text-center"
                >
                    <a
                        :href="contentModel.pdf_in_g"
                        class="btn"
                    >
                        <span class="text-grey-3 bg-gray-3 inverted">key of g</span>
                        <i class="text-grey-3 fas fa-file-pdf ml-1 hide-xs-only"></i>
                    </a>
                </div>
                <div
                    class="item-action flex flex-column uppercase align-center basic-col text-center ml-1"
                >
                    <a
                        :href="contentModel.pdf"
                        class="btn"
                    >
                        <span class="text-grey-3 bg-gray-3 inverted">original key</span>
                        <i class="text-grey-3 fas fa-file-pdf ml-1 hide-xs-only"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Mixin from './_mixin';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'CatalogueListItem',
    mixins: [Mixin, ThemeClasses],
    computed: {
        mappedData() {
            return this.contentModel.list;
        },
    },
    beforeDestroy() {
        this.contentModel = null;
    },
};
</script>
