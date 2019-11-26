<template>
    <div
        class="flex flex-column pa-1 catalogue-card"
        :class="class_object"
    >
        <a
            :href="renderLink ? item.url : false"
            class="no-decoration flex"
            :class="displayInline ? 'flex-row' : 'flex-column'"
        >
            <div
                class="flex flex-column"
                :class="{'thumbnail-col': displayInline}"
            >
                <div
                    class="card-media active corners-5"
                    :class="[thumbnailType, {'mb-1': !displayInline}]"
                >
<!--                    <div-->
<!--                        v-lazy:background-image="mappedData.thumbnail"-->
<!--                        class="thumb-img bg-center"-->
<!--                        :class="item.type === 'chord-and-scale' ? 'no-bg' : ''"-->
<!--                    ></div>-->

                    <img
                        src="https://dmmior4id2ysr.cloudfront.net/assets/images/image-loader.svg"
                        :data-ix-src="mappedData.thumbnail"
                        class="bg-grey-2"
                    >

                    <i
                        v-if="item.type !== 'pack-bundle'"
                        class="add-to-list fas fa-plus"
                        :class="is_added ? 'is-added ' + themeTextClass : 'text-white'"
                        :title="is_added ? 'Remove from list' : 'Add to list'"
                        :data-content-id="item.id"
                        :data-content-type="item.type"
                        @click.stop.prevent="addToList"
                    ></i>

                    <h3
                        v-if="!isGuitareoChordAndScale"
                        class="thumbnail-title tiny font-compressed uppercase dense font-bold text-white"
                        v-html="mappedData.color_title"
                    >
                        {{ mappedData.color_title }}
                    </h3>

                    <div class="lesson-progress overflow">
                        <span
                            class="progress"
                            :class="themeBgClass"
                            :style="'width:' + progress_percent + '%'"
                        ></span>
                    </div>

                    <span
                        v-if="showTrophy"
                        class="bundle-complete flex-center"
                    >
                        <i class="fas fa-trophy"></i>
                    </span>
                    <span
                        v-else
                        class="thumb-hover flex-center"
                    >
                        <i
                            class="fas"
                            :class="thumbnailIcon"
                        ></i>

                        <p
                            v-if="!isReleased"
                            class="tiny text-white font-bold"
                        >
                            {{ releaseDate }}
                        </p>
                    </span>
                </div>
            </div>

            <!--            <img-->
            <!--                v-if="mappedData.sheet_music"-->
            <!--                :src="mappedData.sheet_music"-->
            <!--            >-->
            <div
                class="card-info flex flex-column"
                :class="displayInline ? 'ph-1 align-v-center' : ''"
            >
                <h5
                    class="x-tiny text-grey-4 uppercase"
                    v-html="mappedData.content_type"
                ></h5>

                <h4
                    class="tiny text-black mb-1 font-compressed font-bold capitalize"
                    :class="{'text-center': isGuitareoChordAndScale}"
                >
                    {{ mappedData.black_title }}
                </h4>

                <p
                    v-if="mappedData.show_description"
                    class="x-tiny font-compressed text-grey-4 pb-1 mb-1 item-description always-truncate"
                >
                    {{ mappedData.description.replace(/<[^>]+>/g, '') }}
                </p>

                <h6
                    class="x-tiny font-compressed text-grey-3 uppercase"
                    :class="{'text-center': isGuitareoChordAndScale}"
                >
                    {{ mappedData.grey_title }}
                </h6>
            </div>
        </a>
    </div>
</template>
<script>
import Mixin from './_mixin';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'CatalogueCard',
    mixins: [Mixin, ThemeClasses],
    props: {
        sixWide: {
            type: Boolean,
            default: () => false,
        },

        displayInline: {
            type: Boolean,
            default: () => false,
        },
    },
    computed: {
        mappedData() {
            return this.contentModel.card;
        },

        class_object() {
            return {
                'no-access': this.noAccess,
                completed: this.item.completed,
                'six-wide': this.sixWide,
                'bb-grey-1-1': this.displayInline,
                'display-inline': this.displayInline,
            };
        },

        is_added: {
            cache: false,
            get() {
                return this.item.is_added_to_primary_playlist;
            },
        },

        showTrophy() {
            return this.item.type === 'pack-bundle' && this.item.completed === true;
        },

        isGuitareoChordAndScale() {
            return this.brand === 'guitareo' && this.item.type === 'chord-and-scale';
        },
    },
    beforeDestroy() {
        this.mappedData = null;
    },
};
</script>
