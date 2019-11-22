<template>
    <div class="flex flex-column">
        <div class="flex flex-row pv-3 align-v-center flex-wrap">
            <div class="flex flex-column">
                <h1 class="heading">
                    Notifications
                </h1>
            </div>

            <div class="flex flex-column button-col">
                <a
                    :href="settingsUrl"
                    class="btn bg-dark inverted short text-grey-3"
                >
                    <i class="fas fa-cog mr-1"></i>
                    My Settings
                </a>
            </div>

            <div class="flex flex-column button-col">
                <button
                    class="btn"
                    :disabled="!hasUnreadNotifications"
                    @click.stop="markAllAsRead"
                >
                    <span
                        class="text-white short"
                        :class="themeBgClass"
                    >
                        <i class="fas fa-eye mr-1"></i>
                        Mark All As Read
                    </span>
                </button>
            </div>
        </div>

        <div
            v-if="notifications.length === 0"
            class="flex flex-row pa-3"
        >
            <p
                class="tiny text-grey-3 font-italic"
            >
                You do not appear to have any notifications at this time.
            </p>
        </div>

        <notifications-table-row
            v-for="(item, i) in notificationsArray"
            :key="item.id"
            v-bind="item"
            @notificationRead="markAsRead"
        ></notifications-table-row>

        <div
            v-if="totalPages > 1"
            class="flex flex-row bg-light pagination-row align-h-right"
        >
            <pagination
                :current-page="currentPage"
                :total-pages="totalPages"
                @pageChange="handlePageChange"
            ></pagination>
        </div>
    </div>
</template>
<script>
import * as QueryString from 'query-string';
import NotificationsTableRow from './_NotificationsTableRow.vue';
import Pagination from '../../components/Pagination.vue';
import UserService from '../../assets/js/services/user';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'NotificationsTable',
    components: {
        'notifications-table-row': NotificationsTableRow,
        pagination: Pagination,
    },
    mixins: [ThemeClasses],
    props: {
        brand: {
            type: String,
            default: () => 'recordeo',
        },
        notifications: {
            type: Array,
            default: () => [],
        },
        settingsUrl: {
            type: String,
            default: () => '/members/account/settings/notifications',
        },
        notificationsEndpoint: {
            type: String,
            default: () => '',
        },
        notificationCount: {
            type: Number | String,
            default: () => 1,
        },
    },
    data() {
        return {
            notificationsArray: this.notifications,
            markingAllAsRead: false,
        };
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
        },

        hasUnreadNotifications() {
            return this.notifications.filter(notification => notification.isRead === false).length > 0;
        },
    },
    methods: {
        markAllAsRead() {
            if (!this.markingAllAsRead) {
                this.markingAllAsRead = true;

                // Send request to server
                UserService.markAllNotificationsAsRead()
                    .then((resolved) => {
                        if (resolved) {
                            this.notifications.forEach((notification) => {
                                this.$set(notification, 'isRead', true);
                            });
                        }
                        this.markingAllAsRead = false;
                    });
            }
        },

        markAsRead(payload) {
            const index = this.notifications.map(notification => notification.id).indexOf(payload.id);

            if (payload.isRead) {
                if (payload.canCancel) {
                    UserService.markNotificationAsUnRead(payload.id)
                        .then(resolved => resolved);
                }
            } else {
                UserService.markNotificationAsRead(payload.id)
                    .then(resolved => resolved);
            }

            if (payload.canCancel) {
                this.notificationsArray[index].isRead = !this.notificationsArray[index].isRead;
            }
        },

        handlePageChange(payload) {
            const urlParams = QueryString.parse(location.search);

            urlParams.page = payload.page;

            window.location.href = `${location.protocol}//${location.host 
            }${location.pathname}?${QueryString.stringify(urlParams)}`;
        },
    },
};
</script>
<style>

</style>
