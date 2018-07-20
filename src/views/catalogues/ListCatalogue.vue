<template>
    <div class="flex flex-column">
        <catalogue-list-item
                v-for="(item, i) in $_content"
                :key="item.id"
                :$_item="item"
                :$_brand="$_brand"
                :class="$_card_grid_classes"></catalogue-list-item>
    </div>
</template>
<script>
    import CatalogueListItem from './_CatalogueListItem.vue';

    export default {
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
            $_card_grid_classes: {
                type: String,
                default: () => ''
            }
        }
    }
</script>