<template>
    <a href="/members/forum/thread/123"
       class="content-table-row flex flex-row bt-light-1 no-decoration">
        <div class="flex flex-column avatar-col align-v-center pl-1">
            <div class="thumb-img square rounded bg-center corners-3"
                 :style="'background-image:url(' + thread.authorAvatar + ');'"></div>
        </div>

        <div class="flex flex-column align-v-center pl-1 title-column overflow">

            <p class="tiny text-black font-bold item-title">
                <i v-if="thread.isPinned" class="fas fa-thumbtack"></i>
                {{ thread.title }}
            </p>

            <p class="tiny text-dark uppercase font-italic">
                created <strong>{{ thread.createdOn }}</strong> by <strong>{{ thread.authorUsername }}</strong>
            </p>

            <p class="tiny text-dark text-truncate font-italic hide-md-up capitalize">

                {{ thread.topic }}
                <span style="margin:0 5px;">&#x25AA;</span>
                {{ thread.replyAmount }} {{ thread.replyAmount === 1 ? 'reply' : 'replies' }}
            </p>
        </div>

        <div v-if="thread.isNew" class="flex flex-column icon-col align-center hide-xs-only new-post-badge">
            <span class="text-white corners-3 uppercase flex flex-row align-center font-bold"
                  :class="brandBgClass">
                <i class="fas fa-star flex-center"></i> New
            </span>
        </div>

        <div class="flex flex-column align-center basic-col text-dark font-italic tiny hide-sm-down uppercase">
            {{ thread.topic }}
        </div>

        <div class="flex flex-column align-center basic-col text-dark font-italic tiny hide-sm-down uppercase">
            {{ thread.replyAmount }} {{ thread.replyAmount === 1 ? 'reply' : 'replies' }}
        </div>

        <div class="flex flex-column icon-col align-v-center">
            <div class="square body">
                <i class="fas fa-arrow-circle-right flex-center rounded"
                   :class="thread.isRead ? 'text-light' : brandTextClass"></i>
            </div>
        </div>
    </a>
</template>
<script>
    import BrandClasses from '../../mixins/BrandClasses.js'

    export default {
        mixins: [BrandClasses],
        name: 'forum-threads-table-item',
        props: {
            thread: {
                type: Object,
                default: () => {}
            }
        }
    }
</script>
<style>

</style>