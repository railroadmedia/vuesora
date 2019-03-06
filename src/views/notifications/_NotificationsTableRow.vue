<template>
    <a :href="linkedContent.url"
       class="content-table-row flex flex-row bt-grey-1-1 pa-1 relative no-decoration"
       :class="{'is-read': isRead}"
       @click="markAsRead(false)">
        <div class="flex flex-column avatar-col align-v-center">
            <div class="thumb-img square rounded bg-center"
                 :style="'background-image:url(' + userAvatar + ');'"></div>
        </div>

        <div class="flex flex-column align-v-center ph-1 title-column overflow">

            <p class="tiny text-black item-title">
                <span class="font-bold">{{ userName }}</span>

                {{ notificationTypeString }}

                <span class="font-bold">{{ linkedContent.title }}</span>
            </p>

            <p class="tiny text-grey-3 uppercase font-italic">
                {{ createdOn }}
            </p>
        </div>

        <div class="flex flex-column icon-col align-v-center">
            <div class="body" title="Mark as Read"
                 @click.stop.prevent="markAsRead(true)">
                <i class="far fa-eye flex-center text-grey-2 rounded read-icon"></i>
            </div>
        </div>

        <div class="flex flex-column icon-col align-v-center">
            <div class="body">
                <i class="fas fa-arrow-circle-right flex-center text-grey-2 rounded"></i>
            </div>
        </div>
    </a>
</template>
<script>
    export default {
        name: 'notificatons-table-row',
        props: {
            createdOn: {
                type: String,
                default: () => ''
            },
            id: {
                type: Number,
                default: () => 0
            },
            isRead: {
                type: Boolean,
                default: () => false
            },
            userAvatar: {
                type: String,
                default: () => ''
            },
            userName: '',
            linkedContent: {
                type: Object,
                default: () => {
                    return {
                        title: '',
                        url: ''
                    }
                }
            },
            notificationType: {
                type: String,
                default: () => ''
            }
        },
        computed: {
            notificationTypeString(){
                switch(this.notificationType){
                    case 'comment-reply':
                        return 'replied to your comment on:';
                    case 'comment-like':
                        if (this.userName == '1') {
                            return 'person liked your comment on:';
                        } else {
                            return 'people liked your comment on:';
                        }
                    case 'forum-reply':
                        return 'replied to your post in:';
                    case 'forum-like':
                        if (this.userName == '1') {
                            return 'person liked your post in:';
                        } else {
                            return 'people liked your post in:';
                        }
                    case 'thread-reply':
                        return 'replied to a thread you follow:';
                }
            }
        },
        methods: {
            markAsRead(canCancel = true){
                this.$emit('notificationRead', {
                    id: this.id,
                    isRead: this.isRead,
                    canCancel: canCancel
                });
            }
        }
    }
</script>