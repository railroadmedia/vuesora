<template>
    <div class="flex flex-column">
        <catalogue-list-item
                v-for="(item, i) in $_content"
                :key="'list' + item.id"
                :$_index="item.week || i + 1"
                :$_item="item"
                :$_brand="$_brand"
                :$_themeColor="$_themeColor"
                :class="$_card_grid_classes"
                :$_overview="$_displayItemsAsOverview"
                :$_userId="$_userId"
                :$_displayUserInteractions="$_displayUserInteractions"
                :$_contentTypeOverride="$_contentTypeOverride"
                :$_showNumbers="$_showNumbers"
                :$_noLink="$_lockUnowned && item.is_owned === false"
                :$_lockUnowned="$_lockUnowned"
                :$_is_search="$_is_search"
                :$_forceWideThumbs="$_forceWideThumbs"
                :$_resetProgress="$_resetProgress"
                :$_useThemeColor="$_useThemeColor"
                :$_destroyOnListRemoval="$_destroyOnListRemoval"
                :$_compactLayout="$_compactLayout"
                @addToList="emitAddToList"
                @resetProgress="emitResetProgress"
                @addEvent="addEventToDropdown"></catalogue-list-item>

        <add-event-modal :singleEvent="singleEvent"
                         :$_subscriptionCalendarId="$_subscriptionCalendarId"
                         :$_themeColor="$_themeColor"></add-event-modal>
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
            $_content: {
                type: Array,
                default: () => []
            },
            $_themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            $_userId: {
                type: String,
                default: () => ''
            },
            $_brand: {
                type: String,
                default: () => 'drumeo'
            },
            $_displayItemsAsOverview: {
                type: Boolean,
                default: () => false
            },
            $_displayUserInteractions: {
                type: Boolean,
                default: () => true
            },
            $_card_grid_classes: {
                type: String,
                default: () => ''
            },
            $_contentTypeOverride: {
                type: String,
                default: () => ''
            },
            $_forceWideThumbs: {
                type: Boolean,
                default: () => false
            },
            $_showNumbers: {
                type: Boolean,
                default: false
            },
            $_lockUnowned: {
                type: Boolean,
                default: () => false
            },
            $_is_search: {
                type: Boolean,
                default: () => false
            },
            $_resetProgress: {
                type: Boolean,
                default: () => false
            },
            $_useThemeColor: {
                type: Boolean,
                default: () => true
            },
            $_destroyOnListRemoval: {
                type: Boolean,
                default: () => false
            },
            $_compactLayout: {
                type: Boolean,
                default: () => false
            },
            $_subscriptionCalendarId: {
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
            }
        },
    }
</script>