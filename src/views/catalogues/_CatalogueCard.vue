<template>
    <div class="flex flex-column pa catalogue-card">
        <a>
            <div class="card-media box-4-by-3 corners-5 mb-1"
                 :style="'background-image:url(' + $_thumbnail + ');'">

                <i class="add-to-list fas fa-plus"
                   :class="$_is_added ? 'is-added text-' + $_item.type : 'text-white'"
                   :title="$_is_added ? 'Remove from list' : 'Add to list'"
                   :data-content-id="$_item.id"
                   :data-content-type="$_item.type"
                   @click.stop="addToList"></i>

                <h3 class="thumbnail-title body capitalize"
                    :class="'text-' + $_item.type">{{ mappedData.color_title }}</h3>
            </div>
            <h1 class="tiny text-black font-bold capitalize">{{ mappedData.black_title }}</h1>
            <h4 class="x-tiny text-grey-2 font-italic uppercase">{{ mappedData.grey_title }}</h4>
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
            $_brand: {
                type: String,
                default: () => 'drumeo'
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
                    return this.$_item.is_added;
                }
            },

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