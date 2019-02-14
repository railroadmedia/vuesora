<template>
    <div class="flex flex-column pa-1 catalogue-card">
        <a :href="item.url"
           class="no-decoration">
            <div class="card-media corners-5 mb-1"
                 :class="thumbnailType">

                <div class="thumb-img bg-center"
                     :style="'background-image:url(' + thumbnail + ');'"
                     :class="item.type === 'chord-and-scale' ? 'no-bg' : ''"></div>

                <i class="add-to-list fas fa-plus"
                   v-if="item.type !== 'pack-bundle'"
                   :class="is_added ? 'is-added text-' + theme : 'text-white'"
                   :title="is_added ? 'Remove from list' : 'Add to list'"
                   :data-content-id="item.id"
                   :data-content-type="item.type"
                   @click.stop.prevent="addToList"></i>

                <h3 v-if="item['type'] !== 'chord-and-scale'"
                    class="thumbnail-title tiny font-compressed uppercase dense font-bold"
                    :class="themeTextClass"
                    v-html="mappedData.color_title">
                    {{ mappedData.color_title }}
                </h3>

                <div class="lesson-progress overflow corners-bottom-5">
                    <span class="progress"
                          :class="themeBgClass"
                          :style="'width:' + progress_percent + '%'"></span>
                </div>

                <span v-if="showTrophy" class="bundle-complete flex-center">
                    <i class="fas fa-trophy"></i>
                </span>
                <span v-else class="thumb-hover flex-center">
                    <i class="fas"
                       :class="thumbnailIcon"></i>
                    <p v-if="noAccess"
                       class="x-tiny text-white font-bold">
                        {{ releaseDate }}
                    </p>
                </span>
            </div>

            <img v-if="mappedData.sheet_music" :src="mappedData.sheet_music">

            <h1 class="tiny text-black mb-1 font-compressed font-bold capitalize"
                :class="{'text-center': this.item['type'] === 'chord-and-scale'}">
                {{ mappedData.black_title }}
            </h1>

            <p v-if="mappedData.show_description"
               class="x-tiny font-compressed text-grey-4 mb-1 item-description always-truncate">
                {{ mappedData.description.replace(/<[^>]+>/g, '') }}
            </p>

            <h4 class="x-tiny font-compressed text-grey-3 font-italic uppercase"
                :class="{'text-center': this.item['type'] === 'chord-and-scale'}">
                {{ mappedData.grey_title }}
            </h4>
        </a>
    </div>
</template>
<script>
    import Mixin from './_mixin';
    import * as Model from '../../assets/js/models/_model.js';
    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [Mixin, ThemeClasses],
        name: 'catalogue-card',
        computed: {

            is_added:{
                cache: false,
                get(){
                    return this.item.is_added_to_primary_playlist;
                }
            },

            showTrophy(){
                return this.item['type'] === 'pack-bundle' && this.item['completed'] === true;
            },

            mappedData(){
                const type = this.contentTypeOverride || this.item.type.replace(/-/g, '_');

                const model = new Model[type]({
                    brand: this.brand,
                    post: this.item
                });

                return model['card'];
            },
        },
        mounted(){

        }
    }
</script>