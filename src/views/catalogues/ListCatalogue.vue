<template>
    <div class="flex flex-column">
        <template v-for="(item, i) in content"
        >
            <catalogue-list-item
                :key="'list' + item.id"
                :index="item.week || i + 1"
                :item="item"
                :is-coach="isCoach"
                :content-type="item.type"
                :brand="brand"
                :theme-color="themeColor"
                :use-theme-color="useThemeColor"
                :overview="displayItemsAsOverview"
                :user-id="userId"
                :is-admin="isAdmin"
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
            />

            <div id="branch-paths" :key="'branch' + item.id" v-if="branchPathIndex === i && branchPathContent.data.length > 0" >
                <catalogue-list-item
                    v-for="(branchItem, j) in branchPathContent.data"
                    :key="'branch' + branchItem.id"
                    :index="branchItem.week || j + 1"
                    :item="branchItem"
                    :is-coach="isCoach"
                    :is-branch-path="true"
                    :content-type="branchItem.type"
                    :brand="brand"
                    :theme-color="themeColor"
                    :use-theme-color="useThemeColor"
                    :overview="displayItemsAsOverview"
                    :user-id="userId"
                    :is-admin="isAdmin"
                    :display-user-interactions="displayUserInteractions"
                    :content-type-override="contentTypeOverride"
                    :show-numbers="showNumbers"
                    :no-link="lockUnowned && branchItem.is_owned === false"
                    :lock-unowned="lockUnowned"
                    :is_search="is_search"
                    :force-wide-thumbs="forceWideThumbs"
                    :reset-progress="resetProgress"
                    :destroy-on-list-removal="destroyOnListRemoval"
                    :compact-layout="compactLayout"
                    @addToList="emitAddToList"
                    @progressReset="emitResetProgress"
                    @addEvent="addEventToDropdown"
                />  
            </div>
        </template>

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
        isCoach: {
            type: Boolean,
            default: () => false,
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
        //Branch Paths
        branchPathIndex: {
            type: Number,
            default: () => 0,
        },
        branchPathContent: {
            type: Object,
            default: () => ({}),
        }
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
