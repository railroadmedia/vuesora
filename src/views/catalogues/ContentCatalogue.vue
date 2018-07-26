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
                           :loading="loading"
                           :$_themeColor="$_themeColor"
                           @filterChange="handleFilterChange"
                           @progressChange="handleProgressChange"></catalogue-filters>

        <grid-catalogue v-if="catalogue_type === 'grid'"
                        :$_content="content"
                        :$_brand="$_brand"
                        :$_noWrap="$_noWrapGrid"
                        @addToList="addToListEventHandler"></grid-catalogue>

        <list-catalogue v-if="catalogue_type === 'list'"
                        :$_content="content"
                        :$_brand="$_brand"
                        :$_displayItemsAsOverview="$_displayItemsAsOverview"
                        @addToList="addToListEventHandler"></list-catalogue>

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
            <pagination :currentPage="page"
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
    import axios from 'axios';
    import Utils from '../../assets/js/classes/utils';
    import Toasts from '../../assets/js/classes/toasts'
    import Pagination from '../../components/Pagination.vue';
    import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';

    export default {
        mixins: [UserCatalogueEvents],
        name: 'content-catalogue',
        components: {
            'grid-catalogue': GridCatalogue,
            'list-catalogue': ListCatalogue,
            'pagination': Pagination,
            'catalogue-filters': CatalogueFilters
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
            $_showContentTabs: {
                type: Boolean,
                default: () => false
            },
            $_noWrapGrid: {
                type: Boolean,
                default: () => false
            },
            $_showLoadingAnimation: {
                type: Boolean,
                default: () => false
            }
        },
        data(){
            return {
                page: 1,
                content: this.$_preLoadedContent ? Utils.flattenContent(this.$_preLoadedContent.data) : [],
                filters: this.$_preLoadedContent ? Utils.flattenFilters(this.$_preLoadedContent.meta.filterOptions) : {},
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
                required_user_states: this.$_requiredUserStates || [],
                selected_tab: 'new'
            }
        },
        computed: {

            $_required_fields(){
                let filter_keys = Object.keys(this.filter_params);
                let included_fields = [];

                filter_keys.forEach(filter => {
                    if(this.filter_params[filter] != null){
                        included_fields.push(
                            filter + ',' + this.filter_params[filter]
                        )
                    }
                });

                return included_fields;
            },
        },
        methods: {
            toggleCatalogueType(type){
                this.catalogue_type = type;
            },

            getContent(replace = true){
                if(!this.loading){
                    this.loading = true;

                    axios.get(this.$_contentEndpoint, {
                        params: {
                            brand: this.$_brand,
                            page: this.page,
                            limit: this.$_limit,
                            statuses: this.$_statuses,
                            included_types: this.$_includedTypes,
                            'filter[required_fields]': this.$_required_fields,
                            'filter[required_user_states]': this.required_user_states,
                        }
                    })
                        .then(response => {
                            if(response){
                                // If infinite scroll is enabled:
                                // Just add it to the array, don't replace it
                                if(!replace){
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
                                this.filters = Utils.flattenFilters(response.data.meta.filterOptions);
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

            infiniteScrollEventHandler(){
                let scroll_position = window.pageYOffset + window.innerHeight;
                let scroll_buffer = document.body.scrollHeight - 50;

                if((scroll_position >= scroll_buffer) && (this.page < this.total_pages)){
                    this.loadMore();
                }
            },

            loadNewPosts(){
                this.selected_tab = 'new';
                this.required_user_states = [];

                this.getContent();
            },

            loadStartedPosts(){
                this.selected_tab = 'continue';
                this.required_user_states = ['started'];

                this.getContent();
            },

            loadMore(){
                if(!this.loading){
                    this.page += 1;

                    this.getContent(false);
                }
            },

            handlePageChange(payload){
                this.page = payload.page;

                this.getContent();
            },

            handleFilterChange(payload){
                this.filter_params = payload;
                this.page = 1;

                this.getContent();
            },

            handleProgressChange(payload){
                this.required_user_states = [];

                if(payload.type){
                    this.required_user_states.push(payload.type);
                }

                this.getContent();
            }
        },
        mounted(){
            if(!this.$_preLoadedContent && !this.$_preLoadedContent.results.length){
                this.getContent();
            }

            if(this.$_infiniteScroll && !this.$_loadMoreButton){
                window.addEventListener('scroll', this.infiniteScrollEventHandler);
            }
        },
        beforeDestroy(){
            if(this.$_infiniteScroll && !this.$_loadMoreButton){
                window.removeEventListener('scroll', this.infiniteScrollEventHandler);
            }
        }
    }
</script>