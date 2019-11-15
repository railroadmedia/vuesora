<template>
    <div
        class="flex flex-row nmh-1"
        :class="noWrap ? 'overflow' : 'flex-wrap'"
    >
        <catalogue-card
            v-for="(item, i) in content"
            :key="'grid' + item.id"
            :item="item"
            :content-type="item.type"
            :brand="brand"
            :theme-color="themeColor"
            :use-theme-color="useThemeColor"
            :user-id="userId"
            :lock-unowned="lockUnowned"
            :force-wide-thumbs="forceWideThumbs"
            :content-type-override="contentTypeOverride"
            :six-wide="sixWide"
            :display-inline="displayInline"
            @addToList="emitAddToList"
        ></catalogue-card>
    </div>
</template>
<script>
import CatalogueCard from './_CatalogueCard.vue';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';

export default {
    name: 'GridCatalogue',
    components: {
        'catalogue-card': CatalogueCard,
    },
    mixins: [UserCatalogueEvents],
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
        noWrap: {
            type: Boolean,
            default: () => false,
        },
        forceWideThumbs: {
            type: Boolean,
            default: () => false,
        },
        contentTypeOverride: {
            type: String,
            default: () => '',
        },
        lockUnowned: {
            type: Boolean,
            default: () => false,
        },
        sixWide: {
            type: Boolean,
            default: () => false,
        },
        displayInline: {
            type: Boolean,
            default: () => false,
        },
    },
};
</script>
