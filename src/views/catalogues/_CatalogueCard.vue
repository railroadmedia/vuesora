<template>
    <div class="flex flex-column pa-1 catalogue-card">
        <a :href="$_item.url"
           class="no-decoration">
            <div class="card-media corners-5 mb-1"
                 :class="thumbnailType">

                <div class="thumb-img bg-center"
                     :style="'background-image:url(' + $_thumbnail + ');'"></div>

                <i class="add-to-list fas fa-plus"
                   v-if="$_item.type !== 'pack-bundle'"
                   :class="$_is_added ? 'is-added text-' + theme : 'text-white'"
                   :title="$_is_added ? 'Remove from list' : 'Add to list'"
                   :data-content-id="$_item.id"
                   :data-content-type="$_item.type"
                   @click.stop.prevent="addToList"></i>

                <h3 class="thumbnail-title tiny uppercase"
                    :class="'text-' + theme">{{ mappedData.color_title }}</h3>

                <div class="lesson-progress overflow corners-bottom-5">
                    <span class="progress"
                          :class="'bg-' + theme"
                          :style="'width:' + $_progress_percent + '%'"></span>
                </div>

                <span v-if="$_item.is_new"
                      class="new-badge x-tiny align-v-center uppercase font-bold" :class="'bg-' + theme">
                    <i class="fa fa-star"></i> New
                </span>

                <span class="thumb-hover flex-center">
                    <i class="fas"
                       :class="$_thumbnailIcon"></i>
                    <p v-if="$_noAccess"
                       class="x-tiny text-white font-bold">
                        {{ $_releaseDate }}
                    </p>
                </span>
            </div>

            <img v-if="mappedData.sheet_music" :src="mappedData.sheet_music">
            <h1 class="tiny text-black font-bold capitalize">{{ mappedData.black_title }}</h1>
            <p v-if="mappedData.show_description" class="x-tiny text-grey-4">{{ mappedData.description }}</p>
            <h4 class="x-tiny text-grey-3 font-italic uppercase">{{ mappedData.grey_title }}</h4>
        </a>
    </div>
</template>
<script>
    import DataMapper from '../../assets/js/classes/data-mapper.js';
    import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';

    export default {
        mixins: [UserCatalogueEvents],
        name: 'catalogue-card',
        props: {
            $_item: {
                type: Object
            },
            $_themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            $_brand: {
                type: String,
                default: () => 'drumeo'
            },
            $_userId: {
                type: String,
                default: () => ''
            },
            $_forceWideThumbs: {
                type: Boolean,
                default: () => false
            },
            $_contentTypeOverride: {
                type: String,
                default: ''
            },
            $_lockUnowned: {
                type: Boolean,
                default: () => false
            },
            $_useThemeColor: {
                type: Boolean,
                default: () => false
            }
        },
        data(){
            return {
                mapper: null
            }
        },
        computed: {

            $_is_added:{
                cache: false,
                get(){
                    return this.$_item.is_added_to_primary_playlist;
                }
            },

            $_thumbnail(){
                return this.$_item['thumbnail_url'] ||
                    'https://dmmior4id2ysr.cloudfront.net/assets/images/drumeo_fallback_thumb.jpg'
            },

            $_progress_percent(){
                return this.$_item['progress_percent'];
            },

            $_thumbnailIcon(){
                if(this.$_noAccess){
                    return 'fa-lock';
                }

                return this.$_item.type === 'course' ? 'fa-arrow-right' : 'fa-play';
            },

            $_noAccess(){
                return this.$_lockUnowned && this.$_item.is_owned === false;
            },

            $_releaseDate(){
                return moment(this.$_item['published_on']).format('MMM D');
            },

            theme(){
                if(this.$_useThemeColor){
                    return this.$_themeColor
                }

                return this.$_item.type;
            },

            mappedData(){
                return new DataMapper({
                    content_type: this.$_contentTypeOverride || this.$_item.type,
                    card_type: 'card',
                    post: this.$_item
                });
            },

            thumbnailType(){
                return this.$_item['type'] === 'song' && this.$_forceWideThumbs === false ? 'square' : 'widescreen' + ' ' + this.$_item['type'];
            }
        },
        mounted(){

        }
    }
</script>