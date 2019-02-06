<template>
    <div class="flex flex-column pa-1 catalogue-card">
        <a :href="$_item.url"
           class="no-decoration">
            <div class="card-media corners-5 mb-1"
                 :class="thumbnailType">

                <div class="thumb-img bg-center"
                     :style="'background-image:url(' + $_thumbnail + ');'"
                     :class="$_item.type === 'chord-and-scale' ? 'no-bg' : ''"></div>

                <i class="add-to-list fas fa-plus"
                   v-if="$_item.type !== 'pack-bundle'"
                   :class="$_is_added ? 'is-added text-' + theme : 'text-white'"
                   :title="$_is_added ? 'Remove from list' : 'Add to list'"
                   :data-content-id="$_item.id"
                   :data-content-type="$_item.type"
                   @click.stop.prevent="addToList"></i>

                <h3 v-if="$_item['type'] !== 'chord-and-scale'"
                    class="thumbnail-title tiny font-compressed uppercase dense font-bold"
                    :class="'text-' + theme" v-html="mappedData.color_title">
                    {{ mappedData.color_title }}
                </h3>

                <div class="lesson-progress overflow corners-bottom-5">
                    <span class="progress"
                          :class="'bg-' + theme"
                          :style="'width:' + $_progress_percent + '%'"></span>
                </div>

                <span v-if="$_showTrophy" class="bundle-complete flex-center">
                    <i class="fas fa-trophy"></i>
                </span>
                <span v-else class="thumb-hover flex-center">
                    <i class="fas"
                       :class="$_thumbnailIcon"></i>
                    <p v-if="$_noAccess"
                       class="x-tiny text-white font-bold">
                        {{ $_releaseDate }}
                    </p>
                </span>
            </div>

            <img v-if="mappedData.sheet_music" :src="mappedData.sheet_music">

            <h1 class="tiny text-black mb-1 font-compressed font-bold capitalize"
                :class="{'text-center': this.$_item['type'] === 'chord-and-scale'}">
                {{ mappedData.black_title }}
            </h1>

            <p v-if="mappedData.show_description"
               class="x-tiny font-compressed text-grey-4 mb-1 item-description always-truncate">
                {{ mappedData.description.replace(/<[^>]+>/g, '') }}
            </p>

            <h4 class="x-tiny font-compressed text-grey-3 font-italic uppercase"
                :class="{'text-center': this.$_item['type'] === 'chord-and-scale'}">
                {{ mappedData.grey_title }}
            </h4>
        </a>
    </div>
</template>
<script>
    import Mixin from './_mixin';
    import * as Model from '../../assets/js/models/_model.js';

    export default {
        mixins: [Mixin],
        name: 'catalogue-card',
        computed: {

            $_is_added:{
                cache: false,
                get(){
                    return this.$_item.is_added_to_primary_playlist;
                }
            },

            $_showTrophy(){
                return this.$_item['type'] === 'pack-bundle' && this.$_item['completed'] === true;
            },

            mappedData(){
                const type = this.$_contentTypeOverride || this.$_item.type.replace(/-/g, '_');

                const model = new Model[type]({
                    brand: this.$_brand,
                    post: this.$_item
                });

                return model['card'];
            },
        },
        mounted(){

        }
    }
</script>