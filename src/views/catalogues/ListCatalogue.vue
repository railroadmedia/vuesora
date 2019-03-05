<template>
    <div class="flex flex-column">
        <catalogue-list-item
                v-for="(item, i) in content"
                :key="'list' + item.id"
                :index="item.week || i + 1"
                :item="item"
                :brand="brand"
                :themeColor="themeColor"
                :class="card_grid_classes"
                :overview="displayItemsAsOverview"
                :userId="userId"
                :displayUserInteractions="displayUserInteractions"
                :contentTypeOverride="contentTypeOverride"
                :showNumbers="showNumbers"
                :noLink="lockUnowned && item.is_owned === false"
                :lockUnowned="lockUnowned"
                :is_search="is_search"
                :forceWideThumbs="forceWideThumbs"
                :resetProgress="resetProgress"
                :destroyOnListRemoval="destroyOnListRemoval"
                :compactLayout="compactLayout"
                @addToList="emitAddToList"
                @progressReset="emitResetProgress"
                @addEvent="addEventToDropdown"></catalogue-list-item>

        <add-event-modal :singleEvent="singleEvent"
                         :brand="brand"
                         :subscriptionCalendarId="subscriptionCalendarId"
                         :themeColor="themeColor"
                         @modalClose="handleModalClose"></add-event-modal>
    </div>
</template>
<script>
    import CatalogueListItem from './_CatalogueListItem.vue';
    import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';
    import AddEventModal from '../../components/AddEvent/AddEventModal';

    export default {
        mixins: [UserCatalogueEvents],
        name: 'list-catalogue',
        components: {
            'catalogue-list-item': CatalogueListItem,
            'add-event-modal': AddEventModal
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
            userId: {
                type: String,
                default: () => ''
            },
            brand: {
                type: String,
                default: () => 'drumeo'
            },
            card_type: {
                type: String,
                default: () => 'list'
            },
            displayItemsAsOverview: {
                type: Boolean,
                default: () => false
            },
            displayUserInteractions: {
                type: Boolean,
                default: () => true
            },
            card_grid_classes: {
                type: String,
                default: () => ''
            },
            contentTypeOverride: {
                type: String,
                default: () => ''
            },
            forceWideThumbs: {
                type: Boolean,
                default: () => false
            },
            showNumbers: {
                type: Boolean,
                default: false
            },
            lockUnowned: {
                type: Boolean,
                default: () => false
            },
            is_search: {
                type: Boolean,
                default: () => false
            },
            resetProgress: {
                type: Boolean,
                default: () => false
            },
            destroyOnListRemoval: {
                type: Boolean,
                default: () => false
            },
            compactLayout: {
                type: Boolean,
                default: () => false
            },
            subscriptionCalendarId: {
                type: String,
                default: ''
            }
        },
        data(){
            return {
                singleEvent: {
                    title: '',
                    date: ''
                }
            }
        },
        methods: {

            addEventToDropdown(payload){
                this.singleEvent = payload;
            },

            handleModalClose(){
                setTimeout(() => {
                    this.addEventToDropdown({
                        title: '',
                        date: ''
                    });
                }, 300);
            }
        },
    }
</script>