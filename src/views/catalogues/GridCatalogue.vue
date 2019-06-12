<template>
    <div class="flex flex-row"
         :class="noWrap ? 'overflow' : 'flex-wrap'">
        <catalogue-card
                v-for="(item, i) in content"
                :key="'grid' + item.id"
                :item="item"
                :contentType="item.type"
                :brand="brand"
                :themeColor="themeColor"
                :useThemeColor="useThemeColor"
                :class="card_grid_classes"
                :userId="userId"
                :lockUnowned="lockUnowned"
                :forceWideThumbs="forceWideThumbs"
                :contentTypeOverride="contentTypeOverride"
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
            content: {
                type: Array,
                default: () => []
            },
            themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            useThemeColor: {
                type: Boolean,
                default: () => true
            },
            userId: {
                type: String,
                default: () => ''
            },
            brand: {
                type: String,
                default: () => 'drumeo'
            },
            card_grid_classes: {
                type: String,
                default: () => ''
            },
            noWrap: {
                type: Boolean,
                default: () => false
            },
            forceWideThumbs: {
                type: Boolean,
                default: () => false
            },
            contentTypeOverride: {
                type: String,
                default: () => ''
            },
            lockUnowned: {
                type: Boolean,
                default: () => false
            }
        }
    }
</script>