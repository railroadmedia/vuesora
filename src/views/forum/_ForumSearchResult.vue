<template>
    <a :href="item.url"
       class="content-table-row flex flex-row bt-grey-1-1 no-decoration">
        <div class="flex flex-column avatar-col align-v-center pl-1">
            <div class="thumb-img square rounded bg-center"
                 :style="'background-image:url(' + item.authorAvatar + ');'"></div>
        </div>

        <div class="flex flex-column align-v-center pl-3 title-column overflow">

            <p class="body text-black font-bold item-title" v-html="item.thread.title">
            </p>

            <div class="pl-3 search-result-post">
                <p class="tiny text-black item-title" v-html="item.postBody"></p>

                <p class="x-tiny text-dark uppercase font-italic">
                    replied <strong>{{ item.createdOn }}</strong> by <strong>{{ item.authorUsername }}</strong>
                </p>
            </div>
        </div>

        <div class="flex flex-column align-center basic-col text-dark font-italic x-tiny hide-sm-down uppercase">
            {{ topicIdMap }}
        </div>

        <div class="flex flex-column align-center basic-col text-dark font-italic x-tiny hide-sm-down uppercase">
            {{ (item.thread.replyAmount - 1) }} {{ (item.thread.replyAmount - 1) === 1 ? 'reply' : 'replies' }}
        </div>

        <div class="flex flex-column icon-col align-v-center">
            <div class="square body">
                <i class="fas fa-arrow-circle-right flex-center rounded text-light"></i>
            </div>
        </div>
    </a>
</template>
<script>
    import BrandClasses from '../../mixins/BrandClasses.js'

    export default {
        mixins: [BrandClasses],
        name: 'forum-search-result',
        props: {
            item: {
                type: Object,
                default: () => {}
            }
        },
        computed: {
            topicIdMap() {
                const topics = {
                    1: 'general',
                    2: 'gear',
                    3: 'website feedback',
                    4: 'off topic'
                };

                return topics[this.item.thread.topic];
            }
        },
    }
</script>
<style lang="scss">
</style>