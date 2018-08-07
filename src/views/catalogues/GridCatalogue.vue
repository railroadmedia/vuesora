<template>
    <div class="flex flex-row"
         :class="$_noWrap ? 'overflow' : 'flex-wrap'">
        <catalogue-card
                v-for="(item, i) in $_content"
                :key="'grid' + item.id"
                :$_item="item"
                :$_brand="$_brand"
                :$_themeColor="$_themeColor"
                :class="$_card_grid_classes"
                :$_userId="$_userId"
                :$_forceWideThumbs="$_forceWideThumbs"
                @addToList="emitAddToList"></catalogue-card>
    </div>
</template>
<script>
    import CatalogueCard from './_CatalogueCard.vue';
    import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';

    export default {
        mixins: [UserCatalogueEvents],
        name: 'grid-catalogue',
        components: {
            'catalogue-card': CatalogueCard
        },
        props: {
            $_content: {
                type: Array,
                default: () => []
            },
            $_themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            $_userId: {
                type: String,
                default: () => ''
            },
            $_brand: {
                type: String,
                default: () => 'drumeo'
            },
            $_card_grid_classes: {
                type: String,
                default: () => ''
            },
            $_noWrap: {
                type: Boolean,
                default: () => false
            },
            $_forceWideThumbs: {
                type: Boolean,
                default: () => false
            }
        }
    }
</script>