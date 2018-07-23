<template>
    <div class="flex flex-row flex-wrap">
        <catalogue-card
                v-for="(item, i) in $_content"
                :key="item.id"
                :$_item="item"
                :$_brand="$_brand"
                :class="$_card_grid_classes"
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
            $_brand: {
                type: String,
                default: () => 'drumeo'
            },
            $_card_grid_classes: {
                type: String,
                default: () => ''
            }
        }
    }
</script>