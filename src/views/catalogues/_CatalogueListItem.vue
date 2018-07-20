<template>
    <a class="content-table-row flex flex-row bt-grey-1-1 no-decoration">

        <div class="flex flex-column thumbnail-col align-v-center pl-1">
            <div class="thumb-wrap">
                <div class="thumb-img box-4-by-3 bg-center corners-3"
                     :style="'background-image:url( ' + $_thumbnail + ' );'"></div>

                <!--<span class="new-badge flex-center text-white bg-recordeo">-->
                    <!--<i class="fas fa-star"></i>-->
                <!--</span>-->

                <span class="thumb-hover flex-center">
                    <i class="fas"
                       :class="$_item.type === 'course' ? 'fa-arrow-right' : 'fa-play'"></i>
                </span>
            </div>
        </div>

        <div class="flex flex-column align-v-center pl-1 title-column overflow">

            <p class="tiny text-recordeo uppercase text-truncate"
               :class="'text-' + $_item.type">
                {{ mappedData.color_title }}
            </p>

            <p class="tiny text-black font-bold item-title">
                {{ mappedData.black_title }}
            </p>

            <p class="x-tiny text-dark text-truncate font-italic uppercase hide-md-up">
                <span v-for="(item, i) in mappedData.column_data">
                    <span v-if="i > 0" class="bullet">&#x25CF;</span>

                    {{ item }}
                </span>
            </p>
        </div>

        <div v-for="(item, i) in mappedData.column_data"
             class="flex flex-column uppercase align-center basic-col text-dark font-italic x-tiny hide-sm-down">
            {{ item }}
        </div>

        <div class="flex flex-column icon-col align-v-center">
            <div class="square body">

                <!--TODO: FIX THIS TO REACT DYNAMICALLY-->

                <i class="fas fa-plus flex-center text-light"></i>
            </div>
        </div>

        <div class="flex flex-column icon-col align-v-center">
            <div class="square body">

                <i v-if="$_item.started || $_item.completed"
                   class="fas flex-center text-recordeo rounded"
                   :class="$_item.completed ? 'fa-check-circle text-' + $_item.type : 'fa-adjust text-' + $_item.type"></i>

                <i v-else
                   class="fas flex-center text-light rounded"
                   :class="['course', 'learning-path', 'pack', 'pack-bundle'].indexOf($_item.type) !== -1 ?
                            'fa-arrow-circle-right' : 'fa-play-circle'"></i>
            </div>
        </div>
    </a>
</template>
<script>
    import DataMapper from '../../assets/js/classes/data-mapper.js';

    export default {
        name: 'catalogue-list-item',
        props: {
            $_item: {
                type: Object
            },
            $_brand: {
                type: String,
                default:() => 'drumeo'
            }
        },
        data(){
            return {
                mapper: null
            }
        },
        computed: {

            $_thumbnail(){
                return this.$_item['thumbnail_url'] ||
                    'https://dmmior4id2ysr.cloudfront.net/assets/images/drumeo_fallback_thumb.jpg'
            },
            mappedData(){
                return new DataMapper({
                    content_type: this.$_item.type,
                    card_type: 'list',
                    post: this.$_item
                });
            }
        },
        mounted(){

        }
    }
</script>