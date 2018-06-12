<template>
    <div class="flex flex-column bg-white corners-3 shadow">
        <div class="flex flex-row pa-3 align-v-center flex-wrap">
            <div class="flex flex-column">
                <h1 class="heading">Notifications</h1>
            </div>

            <div class="flex flex-column button-col">
                <a :href="settingsUrl" class="btn bg-dark inverted short text-dark">
                    <i class="fas fa-cog mr-1"></i>
                    My Settings
                </a>
            </div>

            <div class="flex flex-column button-col">
                <a class="btn bg-recordeo short text-white"
                   @click.stop="markAllAsRead">
                    <i class="fas fa-eye mr-1"></i>
                    Mark All As Read
                </a>
            </div>
        </div>

        <div class="flex flex-row pa-3">
            <p v-if="notifications.length === 0"
               class="tiny text-dark font-italic">
                You do not appear to have any notifications at this time.
            </p>
        </div>

        <notifications-table-row v-for="(item, i) in notifications"
                                 :key="item.id"
                                 v-bind="item"
                                 @notificationRead="markAsRead"></notifications-table-row>

        <div class="flex flex-row bg-light pagination-row align-h-right"
             v-if="totalPages > 1">
            <pagination :currentPage="currentPage"
                        :totalPages="totalPages"
                        @pageChange="handlePageChange"></pagination>
        </div>
    </div>
</template>
<script>
    import NotificationsTableRow from './_NotificationsTableRow.vue';
    import Pagination from '../../components/Pagination.vue';
    import Requests from '../../assets/js/classes/requests';
    import * as QueryString from 'query-string';

    export default {
        name: 'notifications-table',
        components: {
            "notifications-table-row": NotificationsTableRow,
            "pagination": Pagination
        },
        props: {
            brand: {
                type: String,
                default: () => 'recordeo'
            },
            notifications: {
                type: Array,
                default: () => []
            },
            settingsUrl: {
                type: String,
                default: () => '/members/account/settings/notifications'
            },
            notificationsEndpoint: {
                type: String,
                default: () => ''
            },
            notificationCount: {
                type: Number,
                default: () => 1
            }
        },
        computed: {
            totalPages() {
                return Math.ceil(this.notificationCount / 20);
            },
            currentPage() {
                const urlParams = QueryString.parse(location.search);

                if (urlParams.page != null) {
                    return Number(urlParams.page);
                }

                return 1;
            }
        },
        methods: {
            markAllAsRead() {
                // Mark all of the rows as read
                const notificationRows = document.querySelectorAll('.content-table-row');
                Array.from(notificationRows).forEach(row => {
                    if (!row.classList.contains('is-read')) {
                        row.classList.add('is-read');
                    }
                });

                // Send request to server
                Requests.markAllNotificationsAsRead()
                    .then(resolved => {
                    });
            },

            markAsRead(payload) {
                Requests.markNotificationAsRead(payload.id)
                    .then(resolved => {
                    });
            },

            handlePageChange(payload) {
                let urlParams = QueryString.parse(location.search);

                urlParams.page = payload.page;

                window.location.href = location.protocol + '//' + location.host +
                    location.pathname + '?' + QueryString.stringify(urlParams);
            }
        }
    }
</script>
<style>

</style>