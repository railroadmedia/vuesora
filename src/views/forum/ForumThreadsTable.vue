<template>
    <div class="flex flex-column bg-white shadow corners-3 content-table">
        <div class="flex flex-row flex-wrap pa-3 align-v-center">
            <div class="flex flex-column align-v-center">
                <div class="flex flex-row">
                    <a href="/members/forums"
                       class="no-decoration text-black mr-3"
                       :class="{ 'bb-recordeo-2': !isFollowedSection }">
                        <h1 class="heading pointer">
                            All Forums
                        </h1>
                    </a>
                    <a href="/members/forums?followed=true"
                       class="no-decoration text-black"
                       :class="{ 'bb-recordeo-2': isFollowedSection }">
                        <h1 class="heading pointer">
                            Followed
                        </h1>
                    </a>
                </div>
            </div>

            <div class="flex flex-column search-box">
                <!--<div class="form-group">-->
                <!--<input id="threadSearch"-->
                <!--type="text"-->
                <!--v-model="searchInterface">-->
                <!--<label for="threadSearch" class="recordeo">Search</label>-->
                <!--</div>-->
            </div>
            <div class="flex flex-column form-group topic-col">
                <!--<clearable-filter labelText="Select a Filter"-->
                                  <!--:filterOptions="['General', 'Courses', 'Tips', 'Website']"-->
                                  <!--:initialValue="topicIdMap"-->
                                  <!--@change="handleFilterChange"></clearable-filter>-->
            </div>
        </div>


        <forum-threads-table-item v-for="thread in pinnedThreads"
                                  :key="thread.id"
                                  :thread="thread"
                                  :brand="brand"></forum-threads-table-item>

        <forum-threads-table-item v-for="thread in threadsArray"
                                  :key="thread.id"
                                  :thread="thread"
                                  :brand="brand"></forum-threads-table-item>

        <div class="flex flex-row bg-light pagination-row align-h-right"
             v-if="totalPages > 1">
            <pagination :currentPage="currentPage"
                        :totalPages="totalPages"
                        @pageChange="handlePageChange"></pagination>
        </div>
    </div>
</template>
<script>
    import ForumThreadsTableItem from './_ForumThreadsTableItem';
    import Pagination from '../../components/Pagination.vue';
    import ClearableFilter from '../../components/ClearableFilter.vue';
    import Requests from '../../assets/js/classes/requests';
    import * as QueryString from 'query-string';

    export default {
        name: 'forum-threads-table',
        components: {
            'forum-threads-table-item': ForumThreadsTableItem,
            'pagination': Pagination,
            'clearable-filter': ClearableFilter
        },
        props: {
            pinnedThreads: {
                type: Array,
                default: () => []
            },
            threads: {
                type: Array,
                default: () => []
            },
            brand: {
                type: String,
                default: () => 'recordeo'
            },
            threadCount: {
                type: Number,
                default: () => 0
            }
        },
        data() {
            return {
                threadsArray: this.threads,
                searchTerm: '',
                filter: 'all',
                timeout: null,
                followed: false
            }
        },
        computed: {
            totalPages() {
                return Math.ceil(this.threadCount / 20);
            },
            searchInterface: {
                get() {
                    return this.searchTerm;
                },
                set(val) {
                    clearTimeout(this.timeout);

                    this.timeout = setTimeout(() => {
                        this.searchTerm = val;

                        this.getThreads();
                    }, 800);
                }
            },
            isFollowedSection() {
                return String(location.search).includes('followed=true');
            },
            currentPage() {
                const urlParams = QueryString.parse(location.search);

                if (urlParams.page != null) {
                    return Number(urlParams.page);
                }

                return 1;
            },
            topicIdMap(){
                const topics = {
                    1: 'general',
                    2: 'gear',
                    3: 'website feedback',
                    4: 'off topic'
                };

                const urlParams = QueryString.parse(location.search);

                if (urlParams["category_ids[]"] != null) {
                    return urlParams["category_ids[]"];
                }

                return 0;
            }

        },
        methods: {
            getThreads() {
                return Requests.getForumThreads()
                    .then(data => {
                        this.threadsArray = data;
                    });
            },

            handlePageChange(payload) {

                let urlParams = QueryString.parse(location.search);

                urlParams.page = payload.page;

                window.location.href = location.protocol + '//' + location.host +
                    location.pathname + '?' + QueryString.stringify(urlParams);
            },

            handleFilterChange(payload) {
                let urlParams = QueryString.parse(location.search);

                urlParams.category_ids = [payload.value];

                window.location.href = location.protocol + '//' + location.host +
                    location.pathname + '?' + QueryString.stringify(urlParams, {arrayFormat: 'bracket'});
            }
        },
        watch: {
            followed() {
                this.getThreads();
            }
        },
        mounted() {
        }
    }
</script>
<style lang="scss">
    @import '../../assets/sass/partials/_variables.scss';

    .search-box {
        @include xSmallOnly {
            margin-bottom: $gutterWidth / 2;
        }
    }

    .search-icon {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }
</style>