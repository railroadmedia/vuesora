<template>
    <div class="flex flex-column bg-white shadow corners-3 content-table">
        <div class="flex flex-row pa align-v-center">
            <div class="flex flex-column align-v-center">
                <h1 class="heading">All Forums</h1>
            </div>

            <div class="flex flex-column align-v-center">
                <div class="flex flex-row align-v-center align-h-right">
                    <label for="followedCheck" class="body">Only show threads that I follow</label>
                    <input id="followedCheck" type="checkbox" class="ml-1">
                </div>
            </div>
        </div>

        <div class="flex flex-row flex-wrap pa">
            <div class="flex flex-column form-group">
                <input id="threadSearch"
                       type="text"
                       v-model="searchInterface">
                <label for="threadSearch" :class="brand">
                    Search
                </label>
            </div>
            <div class="flex flex-column form-group topic-col">
                <select id="topicSelect"
                        title="Filter by Topic"
                        v-model="filterInterface">
                    <option selected disabled></option>
                    <option>
                        General
                    </option>
                    <option>
                        Tips
                    </option>
                    <option>
                        Courses
                    </option>
                    <option>
                        Website
                    </option>
                </select>
                <label for="topicSelect" :class="brand">Topic</label>
            </div>
        </div>

        <!--<div class="flex flex-row align-v-center ph mb">-->
            <!--<input id="followedCheck" type="checkbox" class="mr-1">-->
            <!--<label for="followedCheck" class="body">Only show threads that I follow</label>-->
        <!--</div>-->

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
                currentPage: 1,
                searchTerm: "",
                filter: null,
                timeout: null
            }
        },
        computed: {
            searchInterface: {
                get(){
                    return this.searchTerm;
                },
                set(val){
                    clearTimeout(this.timeout);

                    this.timeout = setTimeout(() => {
                        this.searchTerm = val;

                        this.getThreads();
                    }, 800);
                }
            },

            filterInterface: {
                get() {
                    return this.filter;
                },
                set(val) {
                    this.filter = val;

                    this.getThreads();
                }
            }
        },
        methods: {
            getThreads (){
                return Requests.getForumThreads()
                    .then(data => {
                        this.threadsArray = data;
                    });
            },

            handlePageChange(payload){
                this.currentPage = payload.page;

                this.getThreads();
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