<template>
    <div class="flex flex-column pa-1 catalogue-card">
        <a :href="$_item.url"
           class="no-decoration">
            <div class="card-media corners-5 mb-1"
                 :class="thumbnailType">

                <div class="thumb-img bg-center"
                     :style="'background-image:url(' + $_thumbnail + ');'"></div>

                <i class="add-to-list fas fa-plus"
                   :class="$_is_added ? 'is-added text-' + $_item.type : 'text-white'"
                   :title="$_is_added ? 'Remove from list' : 'Add to list'"
                   :data-content-id="$_item.id"
                   :data-content-type="$_item.type"
                   @click.stop.prevent="addToList"></i>

                <h3 class="thumbnail-title body capitalize"
                    :class="'text-' + $_item.type">{{ mappedData.color_title }}</h3>

                <div class="lesson-progress">
                    <span class="progress"
                          :class="'bg-' + $_item.type"
                          :style="'width:' + $_progress_percent + '%'"></span>
                </div>

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

            mappedData(){
                return new DataMapper({
                    content_type: this.$_contentTypeOverride || this.$_item.type,
                    card_type: 'card',
                    post: this.$_item
                });
            },

            thumbnailType(){
                return this.$_item['type'] === 'song' && this.$_forceWideThumbs === false ? 'square' : 'widescreen';
            }
        },
        mounted(){

        }
    }
</script>