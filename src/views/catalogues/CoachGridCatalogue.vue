<template>
    <div
        class="flex flex-row align-v-top test-coach"
        :class="[noWrap ? 'overflow' : 'flex-wrap', {'nmh-1': !displayInline}]"
    >
        <coach-catalogue-card
            v-for="(item, i) in content"
            :key="'coach-grid' + item.id"
            :item="item"
            :content-type="item.type"
            :brand="brand"
            :theme-color="themeColor"
            :use-theme-color="useThemeColor"
            :user-id="userId"
            :is-admin="isAdmin"
            :lock-unowned="lockUnowned"
            :force-wide-thumbs="forceWideThumbs"
            :content-type-override="contentTypeOverride"
            :six-wide="sixWide"
            :five-wide="fiveWide"
            :show-my-list-action="showMyListAction"
            :display-inline="displayInline"
            @addToList="emitAddToList"
        ></coach-catalogue-card>
    </div>
</template>
<script>
import CoachCatalogueCard from './_CoachCatalogueCard.vue';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';

export default {
    name: 'CoachGridCatalogue',
    components: {
        'coach-catalogue-card': CoachCatalogueCard,
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
        sixWide: {
            type: Boolean,
            default: () => false,
        },
        fiveWide: {
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
