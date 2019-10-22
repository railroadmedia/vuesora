<template>
    <div
        class="content-table-row flex flex-row bb-grey-1-1
         no-decoration pa-1 pointer relative text-grey-3 hover-bg-grey-7 hover-text-black"
        :class="stateClasses"
    >
        <!-- THUMBNAIL COLUMN -->
        <div
            class="flex flex-column align-v-center thumbnail-col hide-xs-only"
            :class="themeColor"
        >
            <div class="thumb-wrap corners-3">
                <div
                    class="thumb-img corners-3"
                    :class="thumbnailType"
                    :style="'background-image:url( ' + mappedData.thumbnail + ' );'"
                >
                    <div class="lesson-progress overflow">
                        <span
                            class="progress"
                            :class="themeBgClass"
                            :style="'width:' + progress_percent + '%'"
                        ></span>
                    </div>

                    <span class="thumb-hover flex-center">
                        <i
                            class="fas fa-play"
                        ></i>
                    </span>
                </div>
            </div>
        </div>

        <!-- TITLES AND COLUMN DATA (on mobile) -->
        <div class="flex flex-column align-v-center ph-1 title-column overflow">
            <p
                class="tiny font-compressed uppercase text-truncate"
                :class="themeTextClass"
            >
                {{ mappedData.color_title }}
            </p>

            <p class="tiny font-compressed text-black font-bold item-title">
                {{ mappedData.black_title }}
            </p>

            <p
                class="x-tiny font-compressed text-grey-3 text-truncate font-italic uppercase hide-md-up"
            >
                <span
                    v-for="(item, i) in mappedData.column_data"
                    :key="item"
                >
                    <span
                        v-if="i > 0"
                        class="bullet"
                    >-</span>
                    {{ item }}
                </span>
            </p>
        </div>

        <!-- SHOW ALL OF THE DATA COLUMNS FROM THE DATA MAPPER -->
        <div
            v-for="(item, i) in mappedData.column_data"
            :key="item"
            class="flex flex-column uppercase align-center basic-col text-center font-italic x-tiny font-compressed hide-sm-down"
        >
            {{ item }}
        </div>

        <!-- VIEW LESSON VIDEO -->
        <div
            v-if="showUserActions"
            class="flex flex-column icon-col align-v-center"
        >
            <a
                :href="item.url"
                class="body no-decoration"
                @click.stop
            >
                <i
                    class="fas fa-video flex-center text-grey-2"
                    :class="themeHoverTextClass"
                    title="Watch Lesson Video"
                ></i>
            </a>
        </div>

        <!-- ADD TO FAVORITES -->
        <div
            v-if="showUserActions"
            class="flex flex-column icon-col align-v-center"
        >
            <div
                class="body"
                @click.stop.prevent="addToList"
            >
                <i
                    class="add-to-list fa-star flex-center hover-text-black"
                    :class="addedToListClasses"
                    :title="is_added ? 'Remove from Favorites' : 'Add to Favorites'"
                ></i>
            </div>
        </div>

        <!-- MARK AS COMPLETE -->
        <div
            v-if="showUserActions"
            class="flex flex-column icon-col align-v-center"
        >
            <div
                class="body"
                @click.stop.prevent="markAsComplete"
            >
                <i
                    class="add-to-list fa-check-circle flex-center hover-text-black"
                    :class="markedAsCompletedClasses"
                    :title="isCompleted ? 'Restart Progress' : 'Mark as Complete'"
                ></i>
            </div>
        </div>
    </div>
</template>

<script>
import CatalogueMixin from '../catalogues/_mixin';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'PlayAlongsListItem',
    mixins: [ThemeClasses, CatalogueMixin],
    props: {
        showUserActions: {
            type: Boolean,
            default: () => false,
        },
    },
    computed: {
        mappedData() {
            return this.contentModel.list;
        },

        isCompleted() {
            return this.item.completed === true;
        },

        stateClasses() {
            return {
                active: this.active,
                'bg-grey-7': this.active,
            };
        },

        addedToListClasses() {
            if (this.is_added) {
                return [this.themeTextClass, this.themeHoverTextClass, 'fas'];
            }

            return [this.themeHoverTextClass, 'text-grey-2', 'far'];
        },

        markedAsCompletedClasses() {
            if (this.isCompleted) {
                return [this.themeTextClass, this.themeHoverTextClass, 'fas'];
            }

            return [this.themeHoverTextClass, 'text-grey-2', 'far'];
        },
    },
    methods: {
        markAsComplete() {
            this.$emit('markAsComplete', this.item.id);
        },
    },
};
</script>
