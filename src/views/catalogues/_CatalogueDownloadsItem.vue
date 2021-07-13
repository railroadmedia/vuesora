<template>
    <div
        class="flex flex-row bb-grey-1-1 no-decoration hover-bg-grey-7 relative text-grey-3 hover-text-black content-table-row pv-1"
    >
        <!-- THUMBNAIL COLUMN -->
        <div
            class="flex flex-column align-v-center"
            :class="[themeColor]"
            style="flex: 0 0 100px;"
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

        <!-- ARTIST & SONGS -->
        <div
            class="flex flex-column align-v-center title-column overflow pl-2"
        >
            <h3
                class="font-regular uppercase"
                :class="[themeTextClass]"
                style="font-size: 13px;"
            >{{ contentModel.artist }}</h3>
            <h3
                class="font-bold text-black"
                style="font-size: 14px;"
            >{{ contentModel.title }}</h3>
        </div>

        <!-- DOWNLOADS -->
        <div
            class="flex flex-column uppercase align-center basic-col text-center"
            style="flex: 0 0 150px;"
        >
            <a
                :href="contentModel.pdf_in_g"
                class="btn"
                style="height: 35px; font-size: 13px;"
            >
                <span class="text-grey-3 bg-gray-3 inverted">key of g</span>
                <i class="text-grey-3 fas fa-file-pdf ml-1"></i>
            </a>
        </div>
        <div
            class="flex flex-column uppercase align-center basic-col text-center ml-1"
            style="flex: 0 0 150px;"
        >
            <a
                :href="contentModel.pdf"
                class="btn"
                style="height: 35px; font-size: 13px;"
            >
                <span class="text-grey-3 bg-gray-3 inverted">original key</span>
                <i class="text-grey-3 fas fa-file-pdf ml-1"></i>
            </a>
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
