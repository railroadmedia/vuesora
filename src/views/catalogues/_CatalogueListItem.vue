<template>
    <a
        class="flex flex-row bt-grey-1-1 no-decoration pa-1 relative bg-white text-grey-3 hover-text-black"
        :class="class_object"
        :href="renderLink ? item.url : false"
    >
        <!--        <div v-if="mappedData.sheet_music && !is_search"-->
        <!--             class="flex flex-column xs-12 pv hide-sm-up">-->
        <!--            <img :src="mappedData.sheet_music" style="width:100%;">-->
        <!--        </div>-->

        <!-- LESSON NUMBERS -->
        <div
            v-if="showNumbers"
            class="flex flex-column align-center number-col title text-black hide-sm-down"
        >
            {{ lesson_number }}
        </div>

        <!-- THUMBNAIL COLUMN -->
        <div
            v-if="!showStudentReviewThumbsAsAvatar"
            class="flex flex-column align-v-center"
            :class="[thumbnailColumnClass, themeColor]"
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
                            class="fas"
                            :class="thumbnailIcon"
                        ></i>
                        <p
                            v-if="!isReleased"
                            class="text-white font-bold"
                            :class="this.overview ? 'tiny' : 'x-tiny'"
                        >
                            {{ releaseDate }}
                        </p>
                    </span>
                </div>
            </div>
        </div>

        <!-- AVATAR INSTEAD OF THUMBNAIL -->
        <div
            v-if="showStudentReviewThumbsAsAvatar"
            class="flex flex-column align-v-center avatar-col"
        >
            <div
                class="thumb-wrap rounded"
                style="border-radius:50%;"
            >
                <div
                    class="thumb-img corners-3 square rounded"
                    :style="'background-image:url( ' + thumbnail + ' );'"
                >

                    <span
                        class="thumb-hover rounded flex-center"
                        style="border-radius:50%;"
                    >
                        <i
                            class="fas"
                            :class="thumbnailIcon"
                        ></i>
                        <p
                            v-if="!isReleased"
                            class="x-tiny text-white font-bold"
                        >
                            {{ releaseDate }}
                        </p>
                    </span>
                </div>
            </div>
        </div>

        <!-- TITLES AND COLUMN DATA (on mobile) -->
        <div class="flex flex-column align-v-center ph-1 title-column overflow">

            <p
                v-if="brand !== 'guitareo'"
                class="tiny font-compressed uppercase text-truncate"
                :class="themeTextClass"
            >
                {{ mappedData.color_title }}
            </p>

            <p class="tiny font-compressed text-black font-bold item-title">
                {{ mappedData.black_title }}
            </p>

            <p
                v-if="overview && mappedData.description"
                class="tiny text-black"
                v-html="mappedData.description"
            >
                {{ mappedData.description }}
            </p>

            <p
                v-if="!is_search"
                class="x-tiny font-compressed text-grey-3 text-truncate font-italic uppercase hide-md-up"
            >
                <span v-for="(item, i) in mappedData.column_data">
                    <span
                        v-if="i > 0"
                        class="bullet"
                    >-</span>

                    {{ item }}
                </span>
            </p>
        </div>

        <!-- SHEET MUSIC IMAGE IF IT EXISTS -->
        <div
            v-if="mappedData.sheet_music && !is_search"
            class="flex flex-column sheet-music-col ph-1 hide-xs-only"
        >
            <img :src="mappedData.sheet_music">
        </div>

        <!-- SHOW ALL OF THE DATA COLUMNS FROM THE DATA MAPPER -->
        <div
            v-for="(item, i) in mappedData.column_data"
            v-if="!is_search"
            class="flex flex-column uppercase align-center basic-col text-center font-italic x-tiny font-compressed hide-sm-down"
        >
            {{ item }}
        </div>

        <!-- ONLY SHOW TYPE ON SEARCHES -->
        <div
            v-if="is_search"
            class="flex flex-column uppercase align-center basic-col text-center font-italic x-tiny hide-sm-down"
        >
            {{ item.type.replace('bundle-', '').replace(/-/g, ' ') }}
        </div>

        <!-- ADD TO LIST OR RESET PROGRESS BUTTONS -->
        <div
            v-if="displayUserInteractions && item.type !== 'learning-path'"
            class="flex flex-column icon-col align-v-center"
            :class="is_search ? '' : 'hide-xs-only'"
        >

            <div
                v-if="resetProgress"
                class="body"
            >
                <i
                    class="fas fa-undo flex-center text-grey-2 hover-text-black reset"
                    title="Reset Progress"
                    @click.stop.prevent="progressReset"
                ></i>
            </div>
            <div
                v-else
                class="body"
            >
                <i
                    class="add-to-list fas fa-plus flex-center hover-text-black"
                    :class="is_added ? 'is-added ' + themeTextClass : 'text-grey-2'"
                    :title="is_added ? 'Remove from list' : 'Add to list'"
                    @click.stop.prevent="addToList"
                ></i>
            </div>
        </div>

        <div
            v-if="is_search && item.type === 'learning-path'"
            class="flex flex-column icon-col align-v-center"
        ></div>

        <!-- PROGRESS INDICATOR OR LOCK ICON -->
        <div
            class="flex flex-column icon-col align-v-center"
            :class="is_search || overview ? 'hide-xs-only' : ''"
        >

            <!-- LOCK ICON OR ADD TO CALENDAR -->
            <div
                v-if="noAccess"
                class="body text-grey-2 hover-text-black"
                title="Add to Calendar"
                data-open-modal="addToCalendarModal"
                @click="addEvent"
            >
                <i
                    class="fas flex-center rounded"
                    :class="isReleased ? 'fa-lock' : 'fa-calendar-plus'"
                ></i>
            </div>

            <!-- STARTED OR COMPLETED -->
            <div
                v-else
                class="body"
            >
                <i
                    v-if="item.started || item.completed"
                    class="fas flex-center rounded hover-text-black"
                    :class="[item.completed ? completedIcon : 'fa-adjust', themeTextClass]"
                ></i>

                <i
                    v-else
                    class="fas flex-center text-grey-2 rounded hover-text-black"
                    :class="['course', 'learning-path', 'pack', 'pack-bundle'].indexOf(item.type) !== -1 ?
                        'fa-arrow-circle-right' : 'fa-play-circle'"
                ></i>
            </div>
        </div>
    </a>
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

        class_object() {
            return {
                active: this.active,
                'content-overview': this.overview,
                'content-table-row': !this.overview,
                'no-access': this.noAccess,
                'wrap-on-mobile': false,
                compact: this.compactLayout,
                'start-learning-path': this.contentTypeOverride === 'learning-path-part',
            };
        },

        showStudentReviewThumbsAsAvatar() {
            return this.item.type === 'student-review' && this.forceWideThumbs === false;
        },

        thumbnailColumnClass() {
            return {
                'large-thumbnail': this.overview,
                'thumbnail-col': !this.overview,
                active: this.active,
                'background-cards': this.item.type === 'learning-path',
            };
        },

        lesson_number() {
            if (this.item.type === 'semester-pack-lesson') {
                return this.contentModel.getPostField('week');
            }

            return this.index;
        },
    },
    beforeDestroy() {
        this.contentModel = null;
    },
};
</script>
