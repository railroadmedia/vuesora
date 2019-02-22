<template>
    <div class="flex flex-column bg-white shadow corners-3 content-table">
        <div class="flex flex-row flex-wrap ph pt-3 align-v-center">
            <div class="flex flex-column mb-3 align-v-center">
                <div class="flex flex-row">
                    <a href="/members/forums"
                       class="no-decoration text-black mr-3"
                       :class="!isFollowedSection ? 'bb-' + themeColor + '-1' : ''">
                        <h1 class="heading pointer">
                            All Forums
                        </h1>
                    </a>
                    <a href="/members/forums?followed=true"
                       class="no-decoration text-black"
                       :class="[isFollowedSection ? 'bb-' + themeColor + '-1' : '', {'hide': searching}]">
                        <h1 class="heading pointer">
                            Followed
                        </h1>
                    </a>
                </div>
            </div>
        </div>
        <div class="flex flex-row flex-wrap ph align-v-center">
            <div class="flex flex-column mb-3 search-box">
                <div class="form-group">
                    <input id="threadSearch"
                           type="text"
                           v-model.lazy="searchInterface">
                    <label for="threadSearch" :class="themeColor">Search</label>

                    <span id="clearSearch" v-if="searching"
                          class="body pointer"
                          @click="clearSearch">
                        <i class="fas fa-times"></i>
                    </span>
                </div>
                <p v-if="searching"
                   class="tiny font-italic text-grey-4">
                    Showing results for <span class="font-bold text-black">"{{ searchInterface }}"</span> in All Forums.
                </p>
            </div>
            <div v-if="!searching && brand !== 'pianote'"
                 class="flex flex-column mb-3 form-group topic-col">

                <div class="form-group xs-12" style="width:100%;">
                    <select id="commentSort" v-model="filterInterface" class="has-input">
                        <option v-for="option in filterOptions"
                                :key="option.label"
                                :value="option.value">{{ option.label }}</option>
                    </select>
                    <label for="commentSort" :class="themeColor">Select a Topic</label>
                </div>
            </div>
        </div>

        <forum-threads-table-item v-for="thread in pinnedThreads"
                                  :key="'pinned' + thread.id"
                                  :thread="thread"
                                  :themeColor="themeColor"
                                  :brand="brand"
                                  v-if="!searching"></forum-threads-table-item>

        <forum-threads-table-item v-for="thread in threadsArray"
                                  :key="thread.id"
                                  :thread="thread"
                                  :themeColor="themeColor"
                                  :brand="brand"
                                  v-if="!searching"></forum-threads-table-item>

        <forum-search-result v-for="item in searchResults"
                                :key="item.id"
                                :item="item"
                                :themeColor="themeColor"
                                :brand="brand"
                                :term="searchInterface"
                                v-if="searching"></forum-search-result>

        <div v-if="searching && searchResults.length === 0" class="flex flex-row content-table-row">
            <div class="flex flex-column pv-3 align-center">
                <i v-if="loading"
                   class="fas fa-spin fa-circle-notch text-recordeo"
                   style="font-size:32px;"></i>
                <p v-else class="body font-italic">
                    No results were found matching that query, please try again.
                </p>
            </div>
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
    import ForumSearchResult from './_ForumSearchResult.vue';
    import Pagination from '../../components/Pagination.vue';
    import ClearableFilter from '../../components/ClearableFilter.vue';
    import ForumService from '../../assets/js/services/forums';
    import * as QueryString from 'query-string';
    import ThemeClasses from "../../mixins/ThemeClasses";

    export default {
        mixins: [ThemeClasses],
        name: 'forum-threads-table',
        components: {
            'forum-threads-table-item': ForumThreadsTableItem,
            'forum-search-result': ForumSearchResult,
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
                type: Number|String,
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
                loading: false,
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


                            this.searchResultsPage = 1;

                            let new_url = window.location.origin + window.location.pathname + '?search=' + val;
                            window.history.replaceState(history.state, null, new_url);

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
                this.loading = true;

                ForumService.getForumSearchResults(
                        this.searchTerm,
                        null,
                        this.searchResultsPage,
                        this.searchResultsPageLength
                    ).then(data => {
                        this.loading = false;
                        this.searching = true;
                        this.searchResults = data.results;
                        this.searchResultsCount = data.count;
                    });
            },

            getThreads() {
                return ForumService.getForumThreads()
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

            },

            clearSearch(){
                const searchInput = document.getElementById('threadSearch');
                const changeEvent = new Event('change');
                let new_url = window.location.origin + window.location.pathname;

                window.history.replaceState(history.state, null, new_url);
                searchInput.value = '';
                searchInput.dispatchEvent(changeEvent);
            }
        },
        watch: {
            followed() {
                this.getThreads();
            }
        },
        created() {
             const urlParams = QueryString.parse(document.location.search);

             if(urlParams['search']){
                 this.searchInterface = urlParams['search'];
                 this.searching = true;
                 this.loading = true;
             }
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

    #clearSearch {
        position:absolute;
        top:50%;
        right:0;
        transform:translateY(-50%);
        height:50px;
        width:50px;
        @include flexCenter();
    }

    .search-icon {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }
</style>