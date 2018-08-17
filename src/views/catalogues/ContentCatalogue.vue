<template>
    <div class="flex flex-column grow">
        <div v-if="$_gridOrListButtons"
             class="flex flex-row pv">
            <button class="btn mh-1"
                    @click="toggleCatalogueType('list')">
                <span class="bg-drumeo"
                      :class="catalogue_type === 'list' ? 'text-white' : 'inverted text-drumeo'">
                    List
                </span>
            </button>
            <button class="btn mh-1"
                    @click="toggleCatalogueType('grid')">
                <span class="bg-drumeo"
                      :class="catalogue_type === 'grid' ? 'text-white' : 'inverted text-drumeo'">
                    Grid
                </span>
            </button>
        </div>

        <catalogue-tab-filters v-if="$_filterTabs.length && !$_filterableValues.length"
                               :$_selected_tab="filter_params.topic"
                               :$_filters="$_filterTabs"
                               @filterChange="handleFilterChange"></catalogue-tab-filters>

        <catalogue-search v-if="$_searchBar"
                          :$_themeColor="$_themeColor"
                          :$_included_types="$_includedTypes"
                          :$_selected_types="selected_types"
                          :$_search_term="search_term"
                          @typeChange="handleTypeChange"
                          @searchChange="handleSearch"></catalogue-search>

        <catalogue-playlist-tabs v-if="$_isPlaylists"
                          :$_themeColor="$_themeColor"
                          :$_included_types="$_includedTypes"></catalogue-playlist-tabs>

        <div class="flex flex-row ph pv-3" v-if="$_showContentTabs && !$_filterableValues.length">
            <span class="heading pointer mr-3"
                  :class="selected_tab === 'new' ? 'bb-' + $_themeColor + '-2 text-black' : 'text-grey-2'"
                  @click="loadNewPosts">
                New
            </span>

            <span class="heading pointer"
                  :class="selected_tab === 'continue' ? 'bb-' + $_themeColor + '-2 text-black' : 'text-grey-2'"
                  @click="loadStartedPosts">
                Continue
            </span>
        </div>

        <catalogue-filters v-if="$_filterableValues.length && !$_showContentTabs"
                           :$_filters="filters"
                           :$_filterableValues="$_filterableValues"
                           :required_user_states="required_user_states"
                           :filter_params="filter_params"
                           :loading="loading"
                           :$_themeColor="$_themeColor"
                           @filterChange="handleFilterChange"
                           @progressChange="handleProgressChange"></catalogue-filters>

        <div v-if="content.length === 0 && $_noResultsMessage.length > 0"
             class="flex flex-row ph pv-3">
            <h4 class="body">{{ $_noResultsMessage }}</h4>
        </div>

        <grid-catalogue v-if="catalogue_type === 'grid'"
                        :$_content="content"
                        :$_brand="$_brand"
                        :$_themeColor="$_themeColor"
                        :$_noWrap="$_noWrapGrid"
                        :$_userId="$_userId"
                        :$_lockUnowned="$_lockUnowned"
                        :$_forceWideThumbs="$_forceWideThumbs"
                        :$_contentTypeOverride="$_contentTypeOverride"
                        @addToList="addToListEventHandler"></grid-catalogue>

        <list-catalogue v-if="catalogue_type === 'list'"
                        :$_content="content"
                        :$_brand="$_brand"
                        :$_themeColor="$_themeColor"
                        :$_userId="$_userId"
                        :$_displayItemsAsOverview="$_displayItemsAsOverview"
                        :$_displayUserInteractions="$_displayUserInteractions"
                        :$_contentTypeOverride="$_contentTypeOverride"
                        :$_lockUnowned="$_lockUnowned"
                        :$_showNumbers="$_showNumbers"
                        :$_is_search="$_searchBar || $_isPlaylists"
                        :$_resetProgress="$_resetProgress"
                        @addToList="addToListEventHandler"
                        @resetProgress="resetProgressEventHandler"></list-catalogue>

        <div v-if="($_infiniteScroll && $_loadMoreButton) && (page < total_pages)"
             class="flex flex-row pa">
            <button class="btn collapse-150 short"
                    @click="loadMore"
                    :disabled="loading">
                <span class="flat text-grey-2">
                    Load More...
                </span>
            </button>
        </div>

        <div v-if="$_paginate && total_pages > 1 && !$_infiniteScroll"
             class="flex flex-row bg-light pagination-row align-h-right">
            <pagination :currentPage="Number(page)"
                        :totalPages="total_pages"
                        @pageChange="handlePageChange"></pagination>
        </div>

        <transition name="show-from-bottom">
            <div id="loadingDialog" v-if="loading && $_showLoadingAnimation"
                 class="flex flex-row align-center">
                <div class="loading-spinner corners-5 shadow pa flex-center"
                     :class="'bg-' + $_themeColor">
                    <i class="fas fa-spinner fa-spin text-white"></i>
                    <p class="x-tiny text-white">Loading Please Wait...</p>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import GridCatalogue from './GridCatalogue.vue';
    import ListCatalogue from './ListCatalogue.vue';
    import CatalogueFilters from './_CatalogueFilters.vue';
    import CatalogueSearch from './_CatalogueSearch.vue';
    import CataloguePlaylistTabs from './_CataloguePlaylistTabs';
    import CatalogueTabFilters from './_CatalogueTabFilters.vue';
    import axios from 'axios';
    import Utils from '../../assets/js/classes/utils';
    import Toasts from '../../assets/js/classes/toasts'
    import Pagination from '../../components/Pagination.vue';
    import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';
    import * as QueryString from 'query-string';

    export default {
        mixins: [UserCatalogueEvents],
        name: 'content-catalogue',
        components: {
            'grid-catalogue': GridCatalogue,
            'list-catalogue': ListCatalogue,
            'pagination': Pagination,
            'catalogue-filters': CatalogueFilters,
            'catalogue-tab-filters': CatalogueTabFilters,
            'catalogue-search': CatalogueSearch,
            'catalogue-playlist-tabs': CataloguePlaylistTabs,
        },
        props: {
            $_catalogueType: {
                type: String,
                default: () => 'grid'
            },
            $_userId: {
                type: String,
                default: () => ''
            },
            $_gridOrListButtons: {
                type: Boolean,
                default: () => false
            },
            $_brand: {
                type: String,
                default: () => 'drumeo'
            },
            $_preLoadedContent: {
                type: Object
            },
            $_limit: {
                type: String,
                default: () => '10'
            },
            $_totalPages: {
                type: String,
                default: () => ''
            },
            $_themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            $_statuses: {
                type: Array,
                default: () => ['published']
            },
            $_contentEndpoint: {
                type: String,
                default: () => '/railcontent/content'
            },
            $_includedTypes: {
                type: Array,
                default: () => ['recording', 'course', 'song', 'play-along', 'student-focus', 'learning-path', 'pack']
            },
            $_requiredUserStates: {
                type: Array,
                default: () => []
            },
            $_filterableValues: {
                type: Array,
                default: () => []
            },
            $_paginate: {
                type: Boolean,
                default: () => false
            },
            $_infiniteScroll: {
                type: Boolean,
                default: () => false
            },
            $_loadMoreButton: {
                type: Boolean,
                default: () => false
            },
            $_destroyOnListRemoval: {
                type: Boolean,
                default: () => false
            },
            $_displayItemsAsOverview: {
                type: Boolean,
                default: () => false
            },
            $_displayUserInteractions: {
                type: Boolean,
                default: () => true
            },
            $_filterTabs: {
                type: Array,
                default: () => []
            },
            $_noWrapGrid: {
                type: Boolean,
                default: () => false
            },
            $_showLoadingAnimation: {
                type: Boolean,
                default: () => false
            },
            $_useUrlParams: {
                type: Boolean,
                default: () => false
            },
            $_noResultsMessage: {
                type: String,
                default: () => ''
            },
            $_forceWideThumbs: {
                type: Boolean,
                default: () => false
            },
            $_contentTypeOverride: {
                type: String,
                default: () => ''
            },
            $_showNumbers: {
                type: Boolean,
                default: () => false
            },
            $_lockUnowned: {
                type: Boolean,
                default: () => false
            },
            $_searchBar: {
                type: Boolean,
                default: () => false
            },
            $_searchEndpoint: {
                type: String,
                default: () => '/laravel/public/railcontent/search'
            },
            $_showContentTabs: {
                type: Boolean,
                default: () => false
            },
            $_isPlaylists: {
                type: Boolean,
                default: () => false
            },
            $_resetProgress: {
                type: Boolean,
                default: () => false
            },
            $_initialPage: {
                default: null
            }
        },
        data() {
            return {
                page: this.$_initialPage || 1,
                content: this.$_preLoadedContent ? Utils.flattenContent(this.$_preLoadedContent.data) : [],
                filters: this.$_preLoadedContent ? Utils.flattenFilters(this.$_preLoadedContent.meta.filterOptions || []) : {},
                total_pages: this.$_preLoadedContent ? Math.ceil(this.$_preLoadedContent.meta.totalResults / this.$_limit) : 0,
                catalogue_type: this.$_catalogueType,
                loading: false,
                filter_params: {
                    artist: null,
                    bpm: null,
                    difficulty: null,
                    instructor: null,
                    style: null,
                    topic: null
                },
                selected_types: null,
                search_term: undefined,
                required_user_states: this.$_requiredUserStates || [],
                selected_tab: 'new'
            }
        },
        computed: {

            $_required_fields() {
                let filter_keys = Object.keys(this.filter_params);
                let included_fields = [];

                filter_keys.forEach(filter => {
                    if (this.filter_params[filter] != null) {
                        included_fields.push(
                            filter + ',' + this.filter_params[filter]
                        )
                    }
                });

                return included_fields;
            },

            selectedTypes() {
                if (this.$_searchBar) {
                    return this.selected_types ? [this.selected_types] : [];
                }

                return this.$_includedTypes;
            },

            $_request_params() {
                return {
                    'required_fields': this.$_required_fields,
                    'statuses': this.$_statuses,
                    'required_user_states': this.required_user_states,
                    'term': this.search_term,
                    'included_types': this.selectedTypes,
                    'page': this.page
                }
            },

            contentEndpoint(){
                if(this.search_term){
                    return this.$_searchEndpoint;
                }

                return this.$_contentEndpoint;
            },
        },
        methods: {
            toggleCatalogueType(type) {
                this.catalogue_type = type;
            },

            getUrlParams() {
                const params = window.location.search;
                const query_object = QueryString.parse(params, {arrayFormat: 'bracket'});
                const keys = Object.keys(query_object);

                keys.forEach(key => {

                    if (key === 'required_user_states') {
                        // query-string is weird and parses arrays with 1 value as a string
                        if (!Array.isArray(query_object[key])) {
                            this.required_user_states = [query_object[key]];
                        }
                        else {
                            query_object[key].forEach(param => {
                                this.required_user_states.push(param);
                            });
                        }
                    }
                    else if (key === 'required_fields') {

                        if (!Array.isArray(query_object[key])) {
                            let this_val = query_object[key].split(',');
                            this.filter_params[this_val[0]] = this_val[1];
                        }
                        else {
                            query_object[key].forEach(param => {
                                let this_val = param.split(',');
                                this.filter_params[this_val[0]] = this_val[1];
                            });
                        }
                    }
                    else if (key === 'included_types' && this.$_searchBar) {
                        if (!Array.isArray(query_object[key])) {
                            let this_val = query_object[key].split(',');
                            this.selected_types[this_val[0]] = this_val[1];
                        }
                        else {
                            query_object[key].forEach(param => {
                                this.selected_types = param;
                            });
                        }
                    }
                    else if (key === 'term' && this.$_searchBar) {
                        this.search_term = query_object[key];
                    }
                    else if (key === 'page' && this.$_paginate) {
                        this.page = query_object[key];
                    }
                });
            },

            setUrlParams() {
                const params = JSON.parse(JSON.stringify(this.$_request_params));

                if(!this.$_searchBar){
                    if(params['included_types']){
                        delete params['included_types'];
                    }
                    if(params['term']){
                        delete params['term'];
                    }
                }

                if(!this.$_paginate){
                    if(params['page']){
                        delete params['page'];
                    }
                }

                // If published is our only status just remove it fromm the url params
                if(this.$_statuses[0] === 'published' && this.$_statuses.length === 1){
                    delete params['statuses'];
                }

                const string = QueryString.stringify(params, {arrayFormat: 'bracket'});

                let new_url = window.location.origin + window.location.pathname + '?' + string;

                window.history.pushState(history.state, null, new_url);
            },

            getContent(replace = true) {
                if (!this.loading) {
                    this.loading = true;

                    console.log(this.$_request_params);

                    axios.get(this.contentEndpoint, {
                        params: {
                            brand: this.$_brand,
                            limit: this.$_limit,
                            statuses: this.$_statuses,
                            ...this.$_request_params
                        }
                    })
                        .then(response => {
                            if (response) {
                                // If infinite scroll is enabled:
                                // Just add it to the array, don't replace it
                                if (!replace) {
                                    this.content = [
                                        ...this.content,
                                        ...Utils.flattenContent(response.data.data)
                                    ]
                                }
                                else {
                                    this.content = Utils.flattenContent(response.data.data);
                                }
                                this.page = Number(response.data.meta.page);
                                this.total_pages = Math.ceil(response.data.meta.totalResults / this.$_limit);

                                if(response.data.meta.filterOptions){
                                    this.filters = Utils.flattenFilters(response.data.meta.filterOptions);
                                }
                            }

                            this.loading = false;
                        })
                        .catch(error => {
                            console.error(error);
                            Toasts.errorWarning('Oops! Something went wrong trying to pull content for you. ' +
                                'Refresh the page and try again.');

                            this.loading = false;
                        })
                }
            },

            infiniteScrollEventHandler() {
                let scroll_position = window.pageYOffset + window.innerHeight;
                let scroll_buffer = document.body.scrollHeight - 50;

                if ((scroll_position >= scroll_buffer) && (this.page < this.total_pages)) {
                    this.loadMore();
                }
            },

            loadNewPosts() {
                this.selected_tab = 'new';
                this.required_user_states = [];

                this.getContent();
            },

            loadStartedPosts() {
                this.selected_tab = 'continue';
                this.required_user_states = ['started'];

                this.getContent();
            },

            loadMore() {
                if (!this.loading) {
                    this.page += 1;

                    this.getContent(false);
                }
            },

            handlePageChange(payload) {
                if(!this.$_isPlaylists){
                    this.page = payload.page;

                    if (this.$_paginate) {
                        this.setUrlParams();
                    }

                    this.getContent();
                }
                else {
                    const params = window.location.search;
                    const query_object = QueryString.parse(params, {arrayFormat: 'bracket'});

                    query_object['page'] = payload.page;

                    window.location.href = location.protocol + '//' + location.host +
                        location.pathname + '?' + QueryString.stringify(query_object);
                }
            },

            handleFilterChange(payload) {
                this.filter_params[payload.key] = payload.value;
                this.page = 1;

                if (this.$_useUrlParams) {
                    this.setUrlParams();
                }
                this.getContent();
            },

            handleProgressChange(payload) {
                this.required_user_states = [];
                this.page = 1;

                if (payload.type) {
                    this.required_user_states.push(payload.type);
                }

                if(this.$_useUrlParams){
                    this.setUrlParams();
                }

                this.getContent();
            },

            handleTypeChange(payload) {
                this.selected_types = payload.value;
                this.page = 1;

                this.setUrlParams();

                this.getContent();
            },

            handleSearch(payload) {
                this.search_term = payload.term || undefined;
                this.page = 1;

                this.setUrlParams();

                this.getContent();
            }
        },
        mounted() {
            if (!this.$_preLoadedContent && !this.$_preLoadedContent.results.length) {
                this.getContent();
            }

            if (this.$_infiniteScroll && !this.$_loadMoreButton) {
                window.addEventListener('scroll', this.infiniteScrollEventHandler);
            }

            if (this.$_useUrlParams) {
                this.getUrlParams();
            }
        },
        beforeDestroy() {
            if (this.$_infiniteScroll && !this.$_loadMoreButton) {
                window.removeEventListener('scroll', this.infiniteScrollEventHandler);
            }
        }
    }
</script>