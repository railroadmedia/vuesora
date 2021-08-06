<template>
    <div
        class="tw-flex tw-flex-col pa-1 tw-border-box tw-w-full sm:tw-w-1/2 md:tw-w-1/3 xl:tw-w-1/4"
        :class="class_object"
    >
        <div class="tw-flex tw-flex-col">
            <div
                class="tw-flex tw-flex-col tw-rounded-lg tw-overflow-hidden"
                :class="[item.type + '-thumbnail']"
            >
                <div
                    class="card-media bg-grey-2 active corners-10"
                    :class="[thumbnailType]"
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

                    <div class="routine-actions tw-flex tw-flex-col tw-justify-center tw-px-4">
                        <div class="tw-text-white tw-text-center pb-2 tw-text-sm sm:tw-text-xs lg:tw-text-sm">Choose your preferred vocal range:</div>
                        <div class="">
                            <div class="tw-flex tw-flex-row">
                                <button
                                    class="btn routine-high"
                                    dusk="routine-high"
                                    @click.stop.prevent="showRoutineSoundSlice('high')"
                                >
                                    <span class="text-white" :class="themeBgClass">high</span>
                                </button>
                                <button
                                    class="btn routine-low"
                                    dusk="routine-low"
                                    @click.stop.prevent="showRoutineSoundSlice('low')"
                                >
                                    <span class="text-white" :class="themeBgClass">low</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-info tw-flex tw-flex-col">
                <p class="tiny tw-text-black mb-1 mt-1">{{ mappedData.description }}</p>
            </div>
        </div>
    </div>
</template>
<script>
import Mixin from './_mixin';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'CatalogueRoutineCard',
    mixins: [Mixin, ThemeClasses],
    computed: {
        mappedData() {
            return this.contentModel.card;
        },

        class_object() {
            return {
                'no-access': this.noAccess,
                completed: this.item.completed,
            };
        },
    },
    beforeDestroy() {
        this.mappedData = null;
    },
    methods: {
        showRoutineSoundSlice(type) {
            let soundSliceSlug = this.contentModel[`${type}_soundslice_slug`];

            this.$emit('showRoutineSoundSlice', { soundSliceSlug, title: this.contentModel.title, routineId: this.contentModel.id });
        },
    },
};
</script>
