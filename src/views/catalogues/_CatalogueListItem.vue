<template>
    <a class="flex flex-row bt-grey-1-1 no-decoration pa-1 relative"
       :class="$_class_object"
       :href="$_renderLink ? false : $_item.url">
        <div v-if="mappedData.sheet_music && !$_is_search"
             class="flex flex-column xs-12 pa hide-sm-up">
            <img :src="mappedData.sheet_music" style="width:100%;">
        </div>

        <!-- LESSON NUMBERS -->
        <div v-if="$_showNumbers"
             class="flex flex-column align-center number-col title text-black hide-sm-down">
            {{ $_index }}
        </div>

        <!-- THUMBNAIL COLUMN -->
        <div v-if="$_item.type !== 'student-review'"
             class="flex flex-column align-v-center"
             :class="[thumbnailColumnClass, theme]">
            <div class="thumb-wrap corners-3">
                <div class="thumb-img corners-3"
                     :class="thumbnailType"
                     :style="'background-image:url( ' + $_thumbnail + ' );'">

                    <div class="lesson-progress overflow">
                        <span class="progress"
                              :class="'bg-' + theme"
                              :style="'width:' + $_progress_percent + '%'"></span>
                    </div>

                    <span class="thumb-hover flex-center">
                        <i class="fas"
                           :class="$_thumbnailIcon"></i>
                        <p v-if="this.$_item.is_owned && !$_isReleased"
                           class="x-tiny text-white font-bold">
                            {{ $_releaseDate }}
                        </p>
                    </span>
                </div>
            </div>
        </div>

        <!-- AVATAR INSTEAD OF THUMBNAIL -->
        <div v-if="$_item.type === 'student-review'"
             class="flex flex-column align-v-center avatar-col">
            <div class="thumb-wrap rounded" style="border-radius:50%;">
                <div class="thumb-img corners-3 square rounded"
                     :style="'background-image:url( ' + $_thumbnail + ' );'">

                    <!--<div class="lesson-progress overflow">-->
                        <!--<span class="progress"-->
                              <!--:class="'bg-' + theme"-->
                              <!--:style="'width:' + $_progress_percent + '%'"></span>-->
                    <!--</div>-->

                    <span class="thumb-hover rounded flex-center"
                          style="border-radius:50%;">
                        <i class="fas"
                           :class="$_thumbnailIcon"></i>
                        <p v-if="this.$_item.is_owned && !$_isReleased"
                           class="x-tiny text-white font-bold">
                            {{ $_releaseDate }}
                        </p>
                    </span>
                </div>
            </div>
        </div>

        <!-- TITLES AND COLUMN DATA (on mobile) -->
        <div class="flex flex-column align-v-center ph-1 title-column overflow">

            <p v-if="$_brand !== 'guitareo'"
               class="tiny font-compressed uppercase text-truncate"
               :class="'text-' + theme">
                {{ mappedData.color_title }}
            </p>

            <p class="tiny font-compressed text-black font-bold item-title">
                {{ mappedData.black_title }}
            </p>

            <p class="tiny text-black"
               v-if="$_overview && mappedData.description"
               v-html="mappedData.description">
                {{ mappedData.description }}
            </p>

            <p v-if="!$_is_search"
               class="x-tiny font-compressed text-grey-3 text-truncate font-italic uppercase hide-md-up">
                <span v-for="(item, i) in mappedData.column_data">
                    <span v-if="i > 0" class="bullet">-</span>

                    {{ item }}
                </span>
            </p>

            <p v-if="$_is_search"
               class="x-tiny font-compressed text-grey-3 text-truncate font-italic uppercase hide-md-up">
                {{ $_item.type.replace('bundle-', '').replace(/-/g, ' ') }}

                <span class="bullet">-</span>

                {{ $_parsed_difficulty }}
            </p>
        </div>

        <!-- SHEET MUSIC IMAGE IF IT EXISTS -->
        <div v-if="mappedData.sheet_music && !$_is_search"
             class="flex flex-column sheet-music-col ph-1 hide-xs-only">
            <img :src="mappedData.sheet_music">
        </div>

        <!-- SHOW ALL OF THE DATA COLUMNS FROM THE DATA MAPPER -->
        <div v-if="!$_is_search"
             v-for="(item, i) in mappedData.column_data"
             class="flex flex-column uppercase align-center basic-col text-grey-3 text-center font-italic x-tiny font-compressed hide-sm-down">
            {{ item }}
        </div>

        <!-- ONLY SHOW TYPE ON SEARCHES -->
        <div v-if="$_is_search"
             class="flex flex-column uppercase align-center basic-col text-grey-3 text-center font-italic x-tiny hide-sm-down">
            {{ $_item.type.replace('bundle-', '').replace(/-/g, ' ') }}
        </div>

        <!-- ONLY SHOW DIFFICULTY ON SEARCHES -->
        <div v-if="$_is_search"
             class="flex flex-column uppercase align-center basic-col text-grey-3 text-center font-italic x-tiny hide-sm-down">
            {{ $_parsed_difficulty }}
        </div>

        <!-- ADD TO LIST OR RESET PROGRESS BUTTONS -->
        <div v-if="$_displayUserInteractions && $_item.type !== 'learning-path'"
             class="flex flex-column icon-col align-v-center"
             :class="$_is_search ? '' : 'hide-xs-only'">

            <div v-if="$_resetProgress"
                 class="body">
                <i class="fas fa-undo flex-center text-grey-2 reset"
                   title="Reset Progress"
                   @click.stop.prevent="resetProgress"></i>
            </div>
            <div v-else
                 class="body">
                <i class="add-to-list fas fa-plus flex-center"
                   :class="$_is_added ? 'is-added text-' + theme : 'text-grey-2'"
                   :title="$_is_added ? 'Remove from list' : 'Add to list'"
                   @click.stop.prevent="addToList"></i>
            </div>
        </div>

        <div v-if="$_is_search && $_item.type === 'learning-path'"
             class="flex flex-column icon-col align-v-center"></div>

        <!-- PROGRESS INDICATOR OR LOCK ICON -->
        <div class="flex flex-column icon-col align-v-center"
             :class="$_is_search || $_overview ? 'hide-xs-only' : ''">

            <!-- LOCK ICON OR ADD TO CALENDAR -->
            <div v-if="$_noAccess" class="body add-to"
                 @click="addEvent"
                 title="Add to Calendar"
                 data-open-modal="addToCalendarModal">
                 <!--:class="!$_isReleased ? 'addeventatc' : ''"-->
                 <!--data-dropdown-y="up"-->
                 <!--data-dropdown-x="right"-->
                 <!--data-intel-apple="true>"-->
                <i v-if="$_isReleased"
                   class="fas fa-lock flex-center rounded text-grey-2"></i>
                <i v-else
                   class="fas fa-calendar-plus flex-center text-grey-2"></i>

                <!--<span v-if="!$_isReleased" class="start">{{ $_item.published_on }}</span>-->
                <!--<span v-if="!$_isReleased" class="timezone">UTC</span>-->
                <!--<span v-if="!$_isReleased" class="title">{{ $_item.title }}</span>-->
            </div>

            <!-- STARTED OR COMPLETED -->
            <div v-else
                 class="body">
                <i v-if="$_item.started || $_item.completed"
                   class="fas flex-center rounded"
                   :class="$_item.completed ? $_completedIcon + ' text-' + theme : 'fa-adjust text-' + theme"></i>

                <i v-else
                   class="fas flex-center text-grey-2 rounded"
                   :class="['course', 'learning-path', 'pack', 'pack-bundle'].indexOf($_item.type) !== -1 ?
                            'fa-arrow-circle-right' : 'fa-play-circle'"></i>
            </div>
        </div>
    </a>
</template>
<script>
    import Mixin from './_mixin';
    import * as Model from '../../assets/js/models/_model.js';
    import { Content as ContentHelpers }  from 'js-helper-functions';

    export default {
        mixins: [Mixin],
        name: 'catalogue-list-item',
        computed: {

            $_class_object(){
                return {
                    'active': this.$_active,
                    'content-overview': this.$_overview,
                    'content-table-row': !this.$_overview,
                    'no-access': this.$_noAccess,
                    // 'no-events': this.$_noAccess,
                    'wrap-on-mobile': this.mappedData.sheet_music != null,
                    'compact' : this.$_compactLayout,
                    'start-learning-path': this.$_contentTypeOverride === 'learning-path-part'
                }
            },

            mappedData(){
                const shows = ContentHelpers.shows();
                let type = this.$_contentTypeOverride || this.$_item.type;

                if(shows.indexOf(type) !== -1){
                    type = 'show';
                }

                const model = new Model[type.replace(/-/g, '_')]({
                    brand: this.$_brand,
                    post: this.$_item
                });

                return model['list'];
            },

            thumbnailColumnClass(){
                return {
                    'large-thumbnail': this.$_overview,
                    'thumbnail-col': !this.$_overview,
                    'active': this.$_active,
                    'background-cards': this.$_item.type === 'learning-path'
                }
            }
        }
    }
</script>