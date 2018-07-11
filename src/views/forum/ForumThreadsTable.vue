<template>
    <div class="flex flex-column bg-white shadow corners-3 content-table">
        <div class="flex flex-row flex-wrap ph-3 pt-3 align-v-center">
            <div class="flex flex-column mb-3 align-v-center">
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

            <div class="flex flex-column mb-3 search-box">
                <div class="form-group">
                    <input id="threadSearch"
                        type="text"
                        v-model="searchInterface">
                    <label for="threadSearch" class="recordeo">Searching</label>
                </div>
            </div>
            <div class="flex flex-column mb-3 form-group topic-col">

                    <div class="form-group xs-12" style="width:100%;">
                        <select id="commentSort" v-model="filterInterface">
                            <option v-for="option in filterOptions"
                                    :key="option.label"
                                    :value="option.value">{{ option.label }}</option>
                        </select>
                        <label for="commentSort" :class="brand">Select a Topic</label>
                    </div>
            </div>
        </div>

        <forum-threads-table-item v-for="thread in pinnedThreads"
                                  :key="'pinned' + thread.id"
                                  :thread="thread"
                                  :brand="brand"
                                  v-if="!searching"></forum-threads-table-item>

        <forum-threads-table-item v-for="thread in threadsArray"
                                  :key="thread.id"
                                  :thread="thread"
                                  :brand="brand"
                                  v-if="!searching"></forum-threads-table-item>

        <div v-for="item in searchResults" v-if="searching">
            <forum-threads-table-item :key="item.id"
                                  :thread="item"
                                  :brand="brand"
                                  v-if="!item.threadId"></forum-threads-table-item>

            <forum-thread-post-search-result :key="item.id"
                               :post="item"
                               :brand="brand"
                               v-if="item.threadId"></forum-thread-post>
        </div>

        <div class="flex flex-row bg-light pagination-row align-h-right"
             v-if="!searching && totalPages > 1">
            <pagination :currentPage="currentPage"
                        :totalPages="totalPages"
                        @pageChange="handlePageChange"></pagination>
        </div>

        <div class="flex flex-row bg-light pagination-row align-h-right"
             v-if="searching && totalSearchPages > 1">
            <pagination :currentPage="searchResultsPage"
                        :totalPages="totalSearchPages"
                        @pageChange="handleSearchPageChange"></pagination>
        </div>
    </div>
</template>
<script>
    import ForumThreadsTableItem from './_ForumThreadsTableItem';
    import ForumThreadPostSearchResult from './_ForumThreadPostSearchResult.vue';
    import Pagination from '../../components/Pagination.vue';
    import ClearableFilter from '../../components/ClearableFilter.vue';
    import Requests from '../../assets/js/classes/requests';
    import * as QueryString from 'query-string';

    export default {
        name: 'forum-threads-table',
        components: {
            'forum-threads-table-item': ForumThreadsTableItem,
            'forum-thread-post-search-result': ForumThreadPostSearchResult,
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
                followed: false,
                filterOptions: [
                    {
                        label: 'All',
                        value: '0'
                    },
                    {
                        label: 'General',
                        value: '1'
                    },
                    {
                        label: 'Gear',
                        value: '2'
                    },
                    {
                        label: 'Website Feedback',
                        value: '3'
                    },
                    {
                        label: 'Off Topic',
                        value: '4'
                    },
                ],
                searching: false,
                searchResults: [],
                searchResultsCount: 0,
                searchResultsPage: 1,
                searchResultsPageLength: 10,
            }
        },
        computed: {
            totalPages() {
                return Math.ceil(this.threadCount / 20);
            },
            totalSearchPages() {
                return Math.ceil(this.searchResultsCount / this.searchResultsPageLength);
            },
            currentFilter(){
                const urlParams = QueryString.parse(location.search);

                if (urlParams["category_ids[]"] != null) {
                    return urlParams["category_ids[]"];
                }

                return '0';
            },
            searchInterface: {
                get() {
                    return this.searchTerm;
                },
                set(val) {

                    clearTimeout(this.timeout);

                    this.searchTerm = val;

                    if (val) {
                        this.timeout = setTimeout(() => {

                            this.searching = true;

                            this.searchResultsPage = 1;

                            this.getSearchResults();
                        }, 800);
                    } else {
                        this.searching = false;
                    }
                }
            },
            filterInterface: {
                get(){
                    return this.filterOptions.filter(option =>
                        option.value === this.currentFilter
                    )[0].value;
                },
                set(value){
                    this.currentFilter = value;

                    this.handleFilterChange(value);
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

                return '0';
            }

        },
        methods: {
            getSearchResults() {
                return Requests.getSearchResults(
                        this.searchTerm,
                        null,
                        this.searchResultsPage,
                        this.searchResultsPageLength
                    ).then(data => {
                        this.searchResults = data.results;
                        this.searchResultsCount = data.count;
                    });
            },

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

            handleSearchPageChange(payload) {

                this.searchResultsPage = payload.page;
                this.getSearchResults();
            },

            handleFilterChange(value) {
                if(value != 0){
                    window.location.href = location.protocol + '//' + location.host +
                        location.pathname + '?category_ids[]=' + value;
                }
                else {
                    window.location.href = location.protocol + '//' + location.host +
                        location.pathname
                }

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