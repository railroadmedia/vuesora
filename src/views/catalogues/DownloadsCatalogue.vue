<template>
    <div class="flex flex-column">
        <catalogue-downloads-item
            v-for="(item, i) in content"
            :key="'downloads' + item.id"
            :index="item.week || i + 1"
            :item="item"
            :content-type="item.type"
            :brand="brand"
            :theme-color="themeColor"
            :use-theme-color="useThemeColor"
            :user-id="userId"
            :display-user-interactions="displayUserInteractions"
            :compact-layout="compactLayout"
        ></catalogue-downloads-item>
    </div>
</template>
<script>
import CatalogueDownloadsItem from './_CatalogueDownloadsItem.vue';

export default {
    name: 'ListCatalogue',
    components: {
        'catalogue-downloads-item': CatalogueDownloadsItem,
    },
    props: {
        content: {
            type: Array,
            default: () => [],
        },
        themeColor: {
            type: String,
            default: () => 'drumeo',
        },
        useThemeColor: {
            type: Boolean,
            default: () => true,
        },
        userId: {
            type: String,
            default: () => '',
        },
        brand: {
            type: String,
            default: () => 'drumeo',
        },
        displayUserInteractions: {
            type: Boolean,
            default: () => true,
        },
        compactLayout: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
        };
    },
    methods: {
    },
};
</script>
