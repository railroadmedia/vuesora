<template>
    <div
        class="flex flex-column pa-1 catalogue-card routine"
        :class="class_object"
    >
        <div class="flex flex-column">
            <div
                class="flex flex-column"
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

                    <div class="routine-actions flex flex-column align-v-center ph-3">
                        <div class="routine-label tiny text-white text-center pb-2">Choose your preferred vocal range:</div>
                        <div class="">
                            <div class="flex flex-row">
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

            <div class="card-info flex flex-column">
                <p class="tiny text-black mb-1 mt-1">{{ mappedData.description }}</p>
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
