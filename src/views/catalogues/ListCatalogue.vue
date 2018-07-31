<template>
    <div class="flex flex-column">
        <catalogue-list-item
                v-for="(item, i) in $_content"
                :key="'list' + item.id"
                :$_index="i + 1"
                :$_item="item"
                :$_brand="$_brand"
                :class="$_card_grid_classes"
                :$_overview="$_displayItemsAsOverview"
                @addToList="emitAddToList"></catalogue-list-item>
    </div>
</template>
<script>
    import CatalogueListItem from './_CatalogueListItem.vue';
    import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';

    export default {
        mixins: [UserCatalogueEvents],
        name: 'list-catalogue',
        components: {
            'catalogue-list-item': CatalogueListItem
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
            $_displayItemsAsOverview: {
                type: Boolean,
                default: () => false
            },
            $_card_grid_classes: {
                type: String,
                default: () => ''
            }
        },
    }
</script>