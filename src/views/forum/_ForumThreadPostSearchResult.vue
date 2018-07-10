<template>
    <a :href="post.url"
       class="content-table-row flex flex-row bt-grey-1-1 no-decoration">
        <div class="flex flex-column avatar-col align-v-center pl-1">
            <div class="thumb-img square rounded bg-center"
                 :style="'background-image:url(' + post.authorAvatar + ');'"></div>
        </div>

        <div class="flex flex-column align-v-center pl-1 title-column overflow">

            <p class="tiny text-black font-bold item-title search-results-post-item" v-html="post.postBody">
            </p>

            <p class="x-tiny text-dark uppercase font-italic">
                posted <strong>{{ post.createdOn }}</strong> by <strong>{{ post.authorUsername }}</strong>
            </p>
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
        name: 'forum-thread-post-search-result',
        props: {
            post: {
                type: Object,
                default: () => {}
            }
        }
    }
</script>
<style lang="scss">
</style>