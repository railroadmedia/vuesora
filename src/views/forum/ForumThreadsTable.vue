<template>

    <div class="tw-flex tw-flex-col tw-flex-grow">

        <!-- Forum Search -->
        <div class="">

            <!-- Forums Tabs -->
            <div v-if="!onlyFollowed" 
                class="flex flex-row flex-wrap ph align-v-center tw-mt-4">
                <div class="flex flex-column mb-3 align-v-center">
                    <div class="flex flex-row">
                        <a
                            :href="currentUrl"
                            class="no-decoration mr-3"
                            :class="[!isFollowedSection ? 'tw-text-black tw-border-0 tw-border-solid tw-border-b-2' : 'text-grey-2', brandBorderColor ]"
                        >
                            <h1 class="heading pointer">
                                All Forums
                            </h1>
                        </a>
                        <a
                            :href=" currentUrl + '?followed=true' "
                            class="no-decoration"
                            :class="[isFollowedSection ? 'tw-text-black tw-border-0 tw-border-solid tw-border-b-2' : 'text-grey-2', brandBorderColor, {'hide': searching}]"
                        >
                            <h1 class="heading pointer">
                                Followed
                            </h1>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Search Bar -->
            <div class="flex flex-row flex-wrap ph-1 align-v-center">
                <div class="flex flex-column tw-mb-6 search-box">
                    <div class="flex flex-row">
                        <div class="flex flex-column form-group pr-1">
                            <input
                                id="threadSearch"
                                ref="searchInput"
                                v-model.lazy="searchInterface"
                                type="text"
                            >
                            <label
                                for="threadSearch"
                                :class="brand"
                            >Search</label>

                            <span
                                v-if="searching"
                                id="clearSearch"
                                class="body pointer"
                                @click="clearSearch"
                            >
                                <i class="fas fa-times"></i>
                            </span>
                        </div>
                        <div class="flex flex-column search-icon-col">
                            <button
                                class="btn collapse-square"
                                @click="$refs.searchInput.blur()"
                            >
                                <span class="bg-white text-black flat">
                                    <i class="fas fa-search"></i>
                                </span>
                            </button>
                        </div>
                    </div>

                    <p
                        v-if="searching"
                        class="tiny font-italic text-grey-4 tw-mt-2 tw-ml-6"
                    >
                        Showing results for <span class="font-bold text-black">"{{ searchInterface }}"</span> in All Forums.
                    </p>
                </div>
            </div>  
        
        </div>

        <div v-if="discussionsArray.length !== 0" class="tw-mb-12">
            <forum-discussion-item 
                v-for="discussion in discussionsArray"
                :key="discussion.id"
                :discussion="discussion"
                :theme-color="themeColor"
                :brand="brand"
            />
        </div>

        <!-- Thread Tables -->
        <div v-if="onlyFollowed">
            <h2 class="tw-text-4xl tw-mb-6">Followed Threads</h2>
        </div>

        
        <forum-threads-table-item
            v-for="thread in pinnedThreads"
            :searching = "searching"
            :key="'pinned' + thread.id"
            :thread="thread"
            :theme-color="themeColor"
            :brand="brand"
        />

        <forum-threads-table-item
            v-for="thread in threadsArray"
            :searching = "searching"
            :key="thread.id"
            :thread="thread"
            :theme-color="themeColor"
            :brand="brand"
        />

        <forum-search-result
            v-for="item in searchResults"
            :searching = "searching"
            :key="item.id"
            :item="item"
            :theme-color="themeColor"
            :brand="brand"
            :term="searchInterface"
        />

        <!-- Pagination -->
        <div
            v-if="!searching && totalPages > 1"
            class="tw-flex tw-py-4"
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
import ForumThreadsTableItem from './_ForumThreadsTableItem';
import ForumDiscussionItem from './_ForumDiscussionItem.vue';
import ForumSearchResult from './_ForumSearchResult.vue';
import Pagination from '../../components/Pagination.vue';
import ClearableFilter from '../../components/ClearableFilter.vue';
import ForumService from '../../assets/js/services/forums';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'ForumThreadsTable',
    components: {
        'forum-threads-table-item': ForumThreadsTableItem,
        'forum-discussion-item': ForumDiscussionItem,
        'forum-search-result': ForumSearchResult,
        'clearable-filter': ClearableFilter,
        pagination: Pagination,
    },
    mixins: [ThemeClasses],
    props: {
        pinnedThreads: {
            type: Array,
            default: () => [],
        },
        threads: {
            type: Array,
            default: () => [],
        },
        discussions: {
            type: Array,
            default: () => [],
        },
        brand: {
            type: String,
            default: () => '',
        },
        threadCount: {
            type: Number | String,
            default: () => 0,
        },
        onlyFollowed: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            discussionsArray: this.discussions,
            threadsArray: this.threads,
            searchTerm: '',
            showTabs: false,
            filter: 'all',
            timeout: null,
            followed: false,
            filterOptions: [
                {
                    label: 'All',
                    value: '0',
                },
                {
                    label: 'General',
                    value: '1',
                },
                {
                    label: 'Gear',
                    value: '2',
                },
                {
                    label: 'Website Feedback',
                    value: '3',
                },
                {
                    label: 'Off Topic',
                    value: '4',
                },
            ],
            loading: false,
            searching: false,
            searchResults: [],
            searchResultsCount: 0,
            searchResultsPage: 1,
            searchResultsPageLength: 10
        };
    },
    computed: {
        brandBorderColor() {
            return 'tw-border-'+this.brand;
        },
        currentUrl(){
            return location.href.replace(location.search, '');
        },
        totalPages() {
            return Math.ceil(this.threadCount / 20);
        },
        totalSearchPages() {
            return Math.ceil(this.searchResultsCount / this.searchResultsPageLength);
        },
        currentFilter() {
            const urlParams = QueryString.parse(location.search);
            if (urlParams['category_ids[]'] != null) {
                return urlParams['category_ids[]'];
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

                        const new_url = `${window.location.origin + window.location.pathname}?search=${val}`;
                        window.history.replaceState(history.state, null, new_url);

                        this.getSearchResults();
                    }, 800);
                } else {
                    this.searching = false;
                }
            },
        },
        filterInterface: {
            get() {
                return this.filterOptions.filter(option => option.value === this.currentFilter)[0].value;
            },
            set(value) {
                this.currentFilter = value;

                this.handleFilterChange(value);
            },
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
        topicIdMap() {
            const topics = {
                1: 'general',
                2: 'gear',
                3: 'website feedback',
                4: 'off topic',
            };

            const urlParams = QueryString.parse(location.search);

            if (urlParams['category_ids[]'] != null) {
                return urlParams['category_ids[]'];
            }

            return '0';
        },

    },
    watch: {
        followed() {
            this.getThreads();
        },
    },
    created() {
        const urlParams = QueryString.parse(document.location.search);

        if (urlParams.search) {
            this.searchInterface = urlParams.search;
            this.searching = true;
            this.loading = true;
        }
    },
    methods: {
        getSearchResults() {
            this.loading = true;

            ForumService.getForumSearchResults(
                this.searchTerm,
                null,
                this.searchResultsPage,
                this.searchResultsPageLength,
            ).then((data) => {
                this.loading = false;
                this.searching = true;
                this.searchResults = data.results;
                this.searchResultsCount = data.count;
            });
        },

        getThreads() {
            return ForumService.getForumThreads()
                .then((data) => {
                    this.threadsArray = data;
                });
        },

        handlePageChange(payload) {
            const urlParams = QueryString.parse(location.search);

            urlParams.page = payload.page;

            window.location.href = `${location.protocol}//${location.host 
            }${location.pathname}?${QueryString.stringify(urlParams)}`;
        },

        handleSearchPageChange(payload) {
            this.searchResultsPage = payload.page;
            this.getSearchResults();
        },

        handleFilterChange(value) {
            if (value != 0) {
                window.location.href = `${location.protocol}//${location.host 
                }${location.pathname}?category_ids[]=${value}`;
            } else {
                window.location.href = `${location.protocol}//${location.host 
                }${location.pathname}`;
            }
        },

        clearSearch() {
            const searchInput = document.getElementById('threadSearch');
            const changeEvent = new Event('change');
            const new_url = window.location.origin + window.location.pathname;

            window.history.replaceState(history.state, null, new_url);
            searchInput.value = '';
            searchInput.dispatchEvent(changeEvent);
        },
    },
};
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
    .search-icon-col {
        flex:0 0 50px;
    }
</style>

