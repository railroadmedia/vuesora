<template>
    <a
        :href="renderLink ? item.url : false"
        class="tw-flex tw-no-underline tw-overflow-hidden tw-rounded-lg tw-relative tw-h-64 tw-bg-cover tw-bg-top"
        :style="'background-image: url(' + mappedData.thumbnail + ')'"
    >
        <img
            src="https://dmmior4id2ysr.cloudfront.net/assets/images/image-loader.svg"
            data-ix-src="mappedData.thumbnail"
            data-ix-fade
            class="tw-hidden"
        >
        <!-- Hover Layer -->
        <div class="tw-absolute tw-flex tw-w-full tw-h-full tw-top-0 tw-left-0 tw-bg-black tw-transition tw-opacity-0 hover:tw-opacity-100 tw-bg-opacity-30">
            <div class="tw-inline-flex tw-w-5 tw-h-5 tw-rounded-full tw-items-center tw-justify-center tw-mt-2 tw-mr-2 tw-ml-auto "
                :class="is_added ? 'is-added ' + themeTextClass + ' tw-bg-white' : 'text-white ' + themeBgClass"
                 @click.stop.prevent="addToList"
                 v-if="item.type !== 'pack-bundle' && showMyListAction"
                :data-content-id="item.id"
                :data-content-type="item.type"
            >
                <i  class="fas fa-bell"
                    :title="is_added ? 'Remove from list' : 'Add to list'"
                ></i>
            </div>
        </div>
        <!-- Coach Name -->
        <div class="tw-h-2/3 tw-w-full tw-justify-center tw-flex tw-mt-auto tw-px-2 tw-pb-4"
             style="background-image: linear-gradient(180deg, rgba(0, 0, 23, 0) 17.28%, #000017 100%);"
        >
            <h4 class="tw-text-base tw-text-white tw-text-center tw-mt-auto tw-uppercase">
                {{ mappedData.black_title }}
            </h4>
        </div>
    </a>
</template>
<script>
import Mixin from './_mixin';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'CoachCatalogueCard',
    mixins: [Mixin, ThemeClasses],
    props: {
        showMyListAction: {
            type: Boolean,
            default: () => true,
        },
    },
    computed: {
        mappedData() {
            return this.contentModel.card;
        },

        is_added: {
            cache: false,
            get() {
                return this.item.is_added_to_primary_playlist;
            },
        },
    },
    beforeDestroy() {
        this.mappedData = null;
    },
};
</script>
