<template>
    <a class="flex flex-row bt-grey-1-1 no-decoration pa-1"
       :class="$_class_object"
       :href="$_noLink ? false : $_item.url">

        <div v-if="$_showNumbers"
             class="flex flex-column align-center icon-col title text-black hide-xs-only">
            {{ $_index }}
        </div>

        <div class="flex flex-column align-v-center"
             :class="[$_overview ? 'large-thumbnail ' + $_themeColor
             : 'thumbnail-col', { 'active': $_active }]">
            <div class="thumb-wrap corners-3">
                <div class="thumb-img corners-3"
                     :class="thumbnailType"
                     :style="'background-image:url( ' + $_thumbnail + ' );'"></div>

                <!--<span class="new-badge flex-center text-white bg-recordeo">-->
                    <!--<i class="fas fa-star"></i>-->
                <!--</span>-->

                <span class="thumb-hover flex-center">
                    <i class="fas"
                       :class="$_thumbnailIcon"></i>
                    <p v-if="$_noAccess"
                       class="x-tiny text-white font-bold">
                        {{ $_releaseDate }}
                    </p>
                </span>
            </div>
        </div>

        <div class="flex flex-column align-v-center ph-1 title-column overflow">

            <p class="tiny text-recordeo uppercase text-truncate"
               :class="'text-' + $_item.type">
                {{ mappedData.color_title }}
            </p>

            <p class="tiny text-black font-bold item-title">
                {{ mappedData.black_title }}
            </p>

            <p class="tiny text-black"
               v-if="$_overview && mappedData.description"
               v-html="mappedData.description">
                {{ mappedData.description }}
            </p>

            <p class="x-tiny text-grey-3 text-truncate font-italic uppercase hide-md-up">
                <span v-for="(item, i) in mappedData.column_data">
                    <span v-if="i > 0" class="bullet">-</span>

                    {{ item }}
                </span>
            </p>
        </div>

        <div v-if="mappedData.sheet_music"
             class="flex flex-column sheet-music-col hide-xs-only">
            <img :src="mappedData.sheet_music">
        </div>

        <div v-if="!$_is_search"
             v-for="(item, i) in mappedData.column_data"
             class="flex flex-column uppercase align-center basic-col text-grey-3 font-italic x-tiny hide-sm-down">
            {{ item }}
        </div>

        <div v-if="$_is_search"
             class="flex flex-column uppercase align-center basic-col text-grey-3 font-italic x-tiny hide-sm-down">
            {{ $_item.type.replace(/-/g, ' ') }}
        </div>

        <div v-if="$_is_search"
             class="flex flex-column uppercase align-center basic-col text-grey-3 font-italic x-tiny hide-sm-down">
            {{ $_parsed_difficulty }}
        </div>

        <div v-if="$_displayUserInteractions && this.$_item.type !== 'learning-path'"
             class="flex flex-column icon-col align-v-center"
             :class="$_overview ? 'hide-xs-only' : ''">
            <div class="body">
                <i class="add-to-list fas fa-plus flex-center"
                   :class="$_is_added ? 'is-added text-' + $_item.type : 'text-grey-2'"
                   :title="$_is_added ? 'Remove from list' : 'Add to list'"
                   :data-content-id="$_item.id"
                   :data-content-type="$_item.type"
                   @click.stop.prevent="addToList"></i>
            </div>
        </div>

        <div class="flex flex-column icon-col align-v-center"
             :class="$_displayUserInteractions ? 'hide-sm-down' : ''">
            <div v-if="$_noAccess" class="body">
                <i class="fas fa-lock flex-center rounded text-grey-2"></i>
            </div>
            <div v-else
                 class="body">
                <i v-if="$_item.started || $_item.completed"
                   class="fas flex-center rounded"
                   :class="$_item.completed ? 'fa-check-circle text-' + $_item.type : 'fa-adjust text-' + $_item.type"></i>

                <i v-else
                   class="fas flex-center text-grey-2 rounded"
                   :class="['course', 'learning-path', 'pack', 'pack-bundle'].indexOf($_item.type) !== -1 ?
                            'fa-arrow-circle-right' : 'fa-play-circle'"></i>
            </div>
        </div>
    </a>
</template>
<script>
    import DataMapper from '../../assets/js/classes/data-mapper.js';
    import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';
    import moment from 'moment';

    export default {
        mixins: [UserCatalogueEvents],
        name: 'catalogue-list-item',
        props: {
            $_item: {
                type: Object
            },
            $_userId: {
                type: String,
                default: () => ''
            },
            $_themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            $_brand: {
                type: String,
                default:() => 'drumeo'
            },
            $_overview: {
                type: Boolean,
                default: () => false
            },
            $_index: {
                type: Number
            },
            $_active: {
                type: Boolean,
                default: () => false
            },
            $_displayUserInteractions: {
                type: Boolean,
                default: () => true
            },
            $_contentTypeOverride: {
                type: String,
                default: () => ''
            },
            $_showNumbers: {
                type: Boolean,
                default: () => false
            },
            $_noLink: {
                type: Boolean,
                default: () => false
            },
            $_lockUnowned: {
                type: Boolean,
                default: () => false
            },
            $_is_search: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                mapper: null
            }
        },
        computed: {

            $_class_object(){
                return {
                    'active': this.$_active,
                    'content-overview': this.$_overview,
                    'content-table-row': !this.$_overview,
                    'no-access': this.$_noAccess,
                    'no-events': this.$_noAccess
                }
            },

            $_is_added:{
                cache: false,
                get(){
                    return this.$_item.is_added_to_primary_playlist;
                }
            },

            $_thumbnail(){
                if(this.$_item.type === 'learning-path'){
                    return this.$_item['background_image_url'] ||
                        'https://dmmior4id2ysr.cloudfront.net/assets/images/drumeo_fallback_thumb.jpg'
                }

                return this.$_item['thumbnail_url'] ||
                    'https://dmmior4id2ysr.cloudfront.net/assets/images/drumeo_fallback_thumb.jpg'
            },

            $_noAccess(){
                return this.$_lockUnowned && this.$_item.is_owned === false;
            },

            $_releaseDate(){
                return moment(this.$_item['published_on']).format('MMM D');
            },

            $_thumbnailIcon(){
                if(this.$_noAccess){
                    return 'fa-lock';
                }

                return this.$_item.type === 'course' ? 'fa-arrow-right' : 'fa-play';
            },

            $_route(){
                return '/members/lessons/' + this.$_item.type + '/' + this.$_item.id
            },

            $_parsed_difficulty(){
                return DataMapper.mapDifficulty(this.$_item);
            },

            mappedData(){
                return new DataMapper({
                    content_type: this.$_contentTypeOverride || this.$_item.type,
                    card_type: 'list',
                    post: this.$_item
                });
            },

            thumbnailType(){
                return this.$_item['type'] === 'song' ? 'square' : 'widescreen';
            }
        },
        mounted(){

        }
    }
</script>