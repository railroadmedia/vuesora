<template>
    <div class="tw-grid tw-gap-4 tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4 lg:tw-grid-cols-5 xl:tw-grid-cols-6 tw-mb-4">
        <!-- Loop throug Cards -->
        <coach-card
            v-for="(item, i) in content"
            :key="i"
            :item="item"
            :content-type="item.type"
            :theme-color="themeColor"
            :user-id="userId"
            :lock-unowned="lockUnowned"
            :content-type-override="contentTypeOverride"
            :show-my-list-action="showMyListAction"
        />
    </div>
</template>
<script>
import CoachCard from './_CoachCard.vue';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';

export default {
    name: 'CoachesGridCatalogue',
    components: {
        'coach-card': CoachCard,
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
        isAdmin: {
            type: Boolean,
            default: () => false,
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
        displayInline: {
            type: Boolean,
            default: () => false,
        },
        showMyListAction: {
            type: Boolean,
            default: () => true,
        },
    },
};
</script>
