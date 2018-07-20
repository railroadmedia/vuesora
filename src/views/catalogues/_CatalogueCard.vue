<template>
    <a class="flex flex-column pa catalogue-card"
       :data-flex-basis="$_flex_basis">
        <div class="card-media box-4-by-3 corners-5 mb-1"
             :style="'background-image:url(' + $_thumbnail + ');'">

            <h3 class="thumbnail-title body capitalize"
                :class="'text-' + $_item.type">{{ mappedData.color_title }}</h3>
        </div>
        <h1 class="tiny text-black font-bold capitalize">{{ mappedData.black_title }}</h1>
        <h4 class="x-tiny text-grey-2 font-italic uppercase">{{ mappedData.grey_title }}</h4>
    </a>
</template>
<script>
    import DataMapper from '../../assets/js/classes/data-mapper.js';

    export default {
        name: 'catalogue-card',
        props: {
            $_item: {
                type: Object
            },
            $_brand: {
                type: String,
                default: () => 'drumeo'
            },
            $_flex_basis: {
                type: String,
                default: () => '20%'
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
                    card_type: 'card',
                    post: this.$_item
                });
            }
        },
        mounted(){

        }
    }
</script>