<template>
    <div class="flex flex-column">
        <catalogue-list-item
            v-for="(item, i) in content"
            :key="'list' + item.id"
            :index="item.week || i + 1"
            :item="item"
            :content-type="item.type"
            :brand="brand"
            :theme-color="themeColor"
            :use-theme-color="useThemeColor"
            :overview="displayItemsAsOverview"
            :user-id="userId"
            :display-user-interactions="displayUserInteractions"
            :content-type-override="contentTypeOverride"
            :show-numbers="showNumbers"
            :no-link="lockUnowned && item.is_owned === false"
            :lock-unowned="lockUnowned"
            :is_search="is_search"
            :force-wide-thumbs="forceWideThumbs"
            :reset-progress="resetProgress"
            :destroy-on-list-removal="destroyOnListRemoval"
            :compact-layout="compactLayout"
            @addToList="emitAddToList"
            @progressReset="emitResetProgress"
            @addEvent="addEventToDropdown"
        ></catalogue-list-item>

        <add-event-modal
            :single-event="singleEvent"
            :brand="brand"
            :subscription-calendar-id="subscriptionCalendarId"
            :theme-color="themeColor"
            @modalClose="handleModalClose"
        ></add-event-modal>
    </div>
</template>
<script>
import CatalogueListItem from './_CatalogueListItem.vue';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';
import AddEventModal from '../../components/AddEvent/AddEventModal';

export default {
    name: 'ListCatalogue',
    components: {
        'catalogue-list-item': CatalogueListItem,
        'add-event-modal': AddEventModal,
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
        cardType: {
            type: String,
            default: () => 'list',
        },
        displayItemsAsOverview: {
            type: Boolean,
            default: () => false,
        },
        displayUserInteractions: {
            type: Boolean,
            default: () => true,
        },
        contentTypeOverride: {
            type: String,
            default: () => '',
        },
        forceWideThumbs: {
            type: Boolean,
            default: () => false,
        },
        showNumbers: {
            type: Boolean,
            default: false,
        },
        lockUnowned: {
            type: Boolean,
            default: () => false,
        },
        isSearch: {
            type: Boolean,
            default: () => false,
        },
        resetProgress: {
            type: Boolean,
            default: () => false,
        },
        destroyOnListRemoval: {
            type: Boolean,
            default: () => false,
        },
        compactLayout: {
            type: Boolean,
            default: () => false,
        },
        subscriptionCalendarId: {
            type: String,
            default: '',
        },
        is_search: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            singleEvent: {
                title: '',
                date: '',
            },
        };
    },
    methods: {

        addEventToDropdown(payload) {
            this.singleEvent = payload;
        },

        handleModalClose() {
            setTimeout(() => {
                this.addEventToDropdown({
                    title: '',
                    date: '',
                });
            }, 300);
        },
    },
};
</script>
