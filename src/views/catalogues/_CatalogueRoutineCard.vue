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
                :class="[{'thumbnail-col': displayInline}, item.type + '-thumbnail']"
            >
                <div
                    class="card-media bg-grey-2 active corners-10"
                    :class="[thumbnailType, {'mb-1': !displayInline}]"
                >
                    <img
                        src="https://dmmior4id2ysr.cloudfront.net/assets/images/image-loader.svg"
                        :data-ix-src="mappedData.thumbnail"
                        data-ix-fade
                        class="bg-grey-2"
                    >

                    <div class="lesson-progress overflow">
                        <span
                            class="progress"
                            :class="themeBgClass"
                            :style="'width:' + progress_percent + '%'"
                        ></span>
                    </div>

                    <div
                        class="flex flex-column align-v-center pl-3"
                        style="z-index: 2; position: absolute; top: 0; left: 0; width: 100%; height: 100%; padding-right: 30%;"
                    >
                        <div class="subtitle font-bold uppercase text-white">routine</div>
                        <div class="subheading font-bold uppercase text-white font-bold">this is the routine title</div>
                    </div>
                </div>
            </div>

            <div class="card-info flex flex-column">
                <p
                    class="tiny text-black mb-1"
                >Want feedback on your playing? Submit a video for student review. We will watch tour submission and the provide.</p>
            </div>
        </a>
    </div>
</template>
<script>
import Mixin from './_mixin';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'CatalogueRoutineCard',
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
    mounted() {
        console.log("CatalogueRoutineCard::mounted mappedData: %s", JSON.stringify(this.mappedData));
    },
};
</script>
