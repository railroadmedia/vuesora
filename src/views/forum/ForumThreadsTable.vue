<template>

    <div class="tw-flex tw-flex-col tw-flex-grow tw-w-full">

        <!-- Forum Tabs -->
        <div v-if="!onlyFollowed && showTabs" 
            class="tw-flex tw-px-4 tw-mt-4">
            <div class="tw-flex tw-flex-col tw-mb-6">
                <div class="tw-flex">
                    <a class="tw-no-underline tw-mr-6"
                        :href="currentUrl"
                        :class="[!isFollowedSection ? 'tw-text-black tw-border-0 tw-border-solid tw-border-b-2' : 'text-grey-2', brandBorderColor ]"
                    >
                        <h3 class="tw-text-2xl tw-cursor-pointer">
                            All Threads
                        </h3>
                    </a>
                    <a class="tw-no-underline"
                        :href=" currentUrl + '?followed=true' "
                        :class="[isFollowedSection ? 'tw-text-black tw-border-0 tw-border-solid tw-border-b-2' : 'text-grey-2', brandBorderColor, {'hide': searching}]"
                    >
                        <h3 class="tw-text-2xl tw-cursor-pointer">
                            Followed
                        </h3>
                    </a>
                </div>
            </div>
        </div>

        <!-- All Threads -->
        <div v-if="!showTabs && !onlyFollowed"
             class="tw-flex tw-px-4 tw-mt-4"
        >
            <div class="tw-flex tw-flex-col tw-mb-6">
                <div class="tw-no-underline tw-mr-6 tw-text-black tw-border-0 tw-border-solid tw-border-b-2"
                        :class="[ brandBorderColor ]"
                >
                    <h3 class="tw-text-2xl tw-cursor-pointer">
                        All New Threads
                    </h3>
                </div>
            </div>   
        </div>

        <!-- Search -->
        <div class="tw-flex tw-px-2 ">
            <div class="tw-flex tw-flex-col tw-mb-6 tw-w-full">
                <div class="tw-flex tw-flex-wrap">

                    <template v-if="!onlyFollowed">
                        <!-- Filter -->
                        <div v-if="!searching"
                            class="flex tw-ml-0 form-group tw-w-full md:tw-w-1/3 md:tw-pr-10"
                        >
                            <div
                                class="form-group xs-12"
                                style="width:100%;"
                            >
                                <select
                                    id="threadSort"
                                    v-model="filterInterface"
                                    class="has-input tw-bg-white"
                                >
                                    <option
                                        v-for="option in filterOptions"
                                        :key="option.label"
                                        :value="option.value"
                                    >
                                        {{ option.label }}
                                    </option>
                                </select>
                                <label
                                    for="threadSort"
                                    :class="brand"
                                >Sort By... </label>
                            </div>
                        </div>
                    </template>

                    <!-- Search Bar -->
                    <div class="tw-flex tw-w-full tw-mb-4 tw-order-first md:tw-order-last"
                        :class="[!onlyFollowed ? 'md:tw-w-2/3' : '']"
                    >
                        <div class="tw-flex tw-flex-col tw-w-full tw-w-full tw-mr-3 form-group">
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
                                class="tw-p-4 tw-cursor-pointer tw-absolute tw-right-0"
                                @click="clearSearch"
                            >
                                <i class="fas fa-times"></i>
                            </span>
                        </div>
                        <!-- Submit Button -->
                        <div class="tw-flex tw-flex-col">
                            <button
                                class="tw-btn-primary tw-px-5 sm:tw-px-12"
                                :class="[brandBGColor]"
                                @click="$refs.searchInput.blur()"
                            >
                                <i class="fas fa-search tw-mr-1 tw-text-sm"></i>
                                <span>Search</span>
                            </button>
                        </div>
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

        <template v-if="!searching">
            <!-- Forum Items -->
            <div v-if="forumsArray.length !== 0" class="tw-mb-12">
                <forum-item 
                    v-for="forum in forumsArray"
                    :key="forum.id"
                    :forum="forum"
                    :brand="brand"
                />
            </div>

            <!-- Thread Items -->
            <div v-if="onlyFollowed">
                <!-- Latest Thread Button -->
                <div class="tw-mb-6 tw-flex tw-justify-center ">
                    <a :href="latestThreadsUrl" class="tw-btn-primary" :class="[brandBGColor]">View All Latest Threads</a>
                </div>

                <h2 class="tw-text-32 tw-mb-6">Followed Threads</h2>

                <template v-if="pinnedThreads.length === 0 && threadsArray.length === 0">
                    <p class="tw-text-base">Any thread you reply to or follow will appear here.</p>
                </template>
            </div>
            
            <!-- Threads Table Header -->
            <div v-if="pinnedThreads.length !== 0 || threadsArray.length !== 0"
                class="tw-flex tw-bg-gray-200 tw-h-10 tw-w-full tw-items-center tw-rounded-t-lg"
            >   
                <div class="tw-uppercase tw-text-gray-500 tw-text-sm tw-font-bold tw-pl-8 tw-w-full lg:tw-w-9/12">
                    Thread Details
                </div>
                <div class="tw-uppercase tw-pr-2 tw-text-gray-500 tw-text-sm tw-font-bold tw-hidden sm:tw-inline-flex tw-flex-shrink-0 tw-w-24">
                    Replies
                </div>
                <div class="tw-uppercase tw-text-gray-500 tw-text-sm tw-font-bold tw-inline-flex tw-px-2 tw-flex-shrink-0 tw-w-28 lg:tw-px-8 lg:tw-w-full lg:tw-max-w-xs">
                    Latest Post
                </div>
            </div>

            <forum-threads-table-item
                v-for="thread in pinnedThreads"
                :key="'pinned' + thread.id"
                :thread="thread"
                :brand="brand"
            />
            <forum-threads-table-item
                v-for="thread in threadsArray"
                :key="thread.id"
                :thread="thread"
                :brand="brand"
            />

            <!-- Thread Pagination -->
            <div v-if="totalPages > 1"
                 class="tw-flex tw-py-4">
                <pagination
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    @pageChange="handlePageChange"
                ></pagination>
            </div>
        </template>

        <template v-if="searching">
            <!-- Search Results -->
            <forum-search-result
                v-for="item in searchResults"
                :searching = "searching"
                :key="item.id"
                :item="item"
                :brand="brand"
                :term="searchInterface"
            />

            <!-- Results Pagination -->
            <div v-if="totalSearchPages > 1"
                 class="tw-flex tw-py-4">
                <pagination
                    :current-page="currentPage"
                    :total-pages="totalSearchPages"
                    @pageChange="handleSearchPageChange"
                ></pagination>
            </div>
        </template>

    </div>
</template>

<script>

import * as QueryString from 'query-string';
import ForumThreadsTableItem from './_ForumThreadsTableItem';
import ForumItem from './_ForumItem.vue';
import ForumSearchResult from './_ForumSearchResult.vue';
import Pagination from '../../components/Pagination.vue';
import ClearableFilter from '../../components/ClearableFilter.vue';
import ForumService from '../../assets/js/services/forums';

export default {
    name: 'ForumThreadsTable',
    components: {
        'forum-threads-table-item': ForumThreadsTableItem,
        'forum-item': ForumItem,
        'forum-search-result': ForumSearchResult,
        'clearable-filter': ClearableFilter,
        pagination: Pagination,
    },
    props: {
        pinnedThreads: {
            type: Array,
            default: () => [],
        },
        threads: {
            type: Array,
            default: () => [],
        },
        forums: {
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
        showTabs: {
            type: Boolean,
            default: () => true,
        },
      latestThreadsUrl: {
        type: String,
        default: () => '/threads/latest',
      },
    },
    data() {
        return {
            forumsArray: this.forums,
            threadsArray: this.threads,
            searchTerm: '',
            filter: 'all',
            timeout: null,
            followed: false,
            filterOptions: [
                {
                    label: 'Oldest',
                    value: 'last_post_published_on'
                },
                {
                    label: 'Most recent',
                    value: '-last_post_published_on'
                },
                {
                    label: 'My threads',
                    value: 'mine'
                }
            ],
            loading: false,
            searching: false,
            searchResults: [],
            searchResultsCount: 0,
            searchResultsPage: 1,
            searchResultsPageLength: 8
        };
    },
    computed: {
        brandBorderColor() {
            return 'tw-border-' + this.brand;
        },
        brandBGColor() {
            return 'tw-bg-'+ this.brand;
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
        isFollowedSection() {
            return String(location.search).includes('followed=true');
        },
        currentPage() {
            const urlParams = QueryString.parse(location.search);
            if(!this.searching) {
                if (urlParams.page != null) {
                    return Number(urlParams.page);
                }
                return 1;
            } else {
                return this.searchResultsPage;
            }
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
        currentFilter: {
            get() {
                const urlParams = QueryString.parse(location.search);
                if (urlParams['sortby_val'] != null) {
                    return urlParams['sortby_val'];
                }
                return '-last_post_published_on';
            },
            set(val) {
                return val;
            }
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
                }${location.pathname}?sortby_val=${value}`;
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
