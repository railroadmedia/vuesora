<template>
    <div class="flex flex-column bg-white shadow corners-3 content-table">
        <div class="flex flex-row pa">
            <h1 class="heading">All Forums</h1>
        </div>

        <forum-threads-table-item v-for="thread in threadsArray"
                                  :key="thread.id"
                                  :thread="thread"
                                  :brand="brand"></forum-threads-table-item>

        <div class="flex flex-row bg-light pagination-row align-h-right">
            <pagination
                    :currentPage="currentPage"
                    :totalPages="10"
                    :brand="brand"
                    @pageChange="handlePageChange"></pagination>
        </div>
    </div>
</template>
<script>
    import ForumThreadsTableItem from './_ForumThreadsTableItem';
    import Pagination from '../../components/Pagination.vue';
    import Requests from '../../assets/js/classes/requests';

    export default {
        name: 'forum-threads-table',
        components: {
            'forum-threads-table-item': ForumThreadsTableItem,
            'pagination': Pagination
        },
        props: {
            threads: {
                type: Array,
                default: () => []
            },
            brand: {
                type: String,
                default: () => 'recordeo'
            }
        },
        data (){
            return {
                threadsArray: this.threads,
                currentPage: 1
            }
        },
        methods: {
            getThreads: () => Requests.getForumThreads(),

            handlePageChange(payload){
                this.currentPage = payload.page;

                this.getThreads()
                    .then(data => {
                        this.threadsArray = data;
                    });
            }
        },
        mounted (){
            // setInterval(() => {
            //     this.getThreads().then(resolution => {
            //         this.threadsArray = resolution;
            //     })
            // }, 5000);
        }
    }
</script>
<style>

</style>