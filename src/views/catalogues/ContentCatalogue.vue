<template>
    <div class="flex flex-column">
        <div class="flex flex-row">
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

        <grid-catalogue v-if="catalogue_type === 'grid'"
                        :$_content="content"
                        :$_brand="$_brand"></grid-catalogue>

        <list-catalogue v-if="catalogue_type === 'list'"
                        :$_content="content"
                        :$_brand="$_brand"></list-catalogue>

        <div v-if="$_infinite_scroll && $_load_more_button"
             class="flex flex-row pa">
            <button class="btn"
                    @click="getContent"
                    :disabled="loading">
                <span class="flat"
                      :class="'text-' + $_brand">
                    Load More...
                </span>
            </button>
        </div>

        <div v-if="$_paginate && total_pages > 1 && !$_infinite_scroll"
             class="flex flex-row bg-light pagination-row align-h-right">
            <pagination :currentPage="page"
                        :totalPages="total_pages"
                        @pageChange="handlePageChange"></pagination>
        </div>
    </div>
</template>
<script>
    import GridCatalogue from './GridCatalogue.vue';
    import ListCatalogue from './ListCatalogue.vue';
    import axios from 'axios';
    import Utils from '../../assets/js/classes/utils';
    import Pagination from '../../components/Pagination.vue';

    export default {
        name: 'content-catalogue',
        components: {
            'grid-catalogue': GridCatalogue,
            'list-catalogue': ListCatalogue,
            'pagination': Pagination,
        },
        props: {
            $_catalogue_type: {
                type: String,
                default: () => true
            },
            $_brand: {
                type: String,
                default: () => 'drumeo'
            },
            $_pre_loaded_content: {
                type: Array,
                default: () => []
            },
            $_limit: {
                type: Number,
                default: () => 10
            },
            $_statuses: {
                type: Array,
                default: () => ['published']
            },
            $_content_endpoint: {
                type: String,
                default: () => '/content'
            },
            $_paginate: {
                type: Boolean,
                default: () => false
            },
            $_infinite_scroll: {
                type: Boolean,
                default: () => false
            },
            $_load_more_button: {
                type: Boolean,
                default: () => false
            }
        },
        data(){
            return {
                page: 1,
                content: this.$_pre_loaded_content || [],
                catalogue_type: this.$_catalogue_type || 'grid',
                total_pages: 0,
                loading: false,
            }
        },

        methods: {
            toggleCatalogueType(type){
                this.catalogue_type = type;
            },

            getContent(){
                if(!this.loading){
                    this.loading = true;

                    axios.get(this.$_content_endpoint, {
                        params: {
                            brand: this.$_brand,
                            page: this.page,
                            limit: this.$_limit,
                            statuses: this.$_statuses,
                            included_types: ['recording', 'course', 'song', 'play-along', 'student-focus', 'learning-path', 'pack']
                        }
                    })
                        .then(response => {
                            if(response){
                                // If infinite scroll is enabled:
                                // Just add it to the array, don't replace it
                                if(this.$_infinite_scroll && this.content.length > 0){
                                    this.content = [
                                        ...this.content,
                                        ...Utils.flattenContent(response.data.results)
                                    ]
                                }
                                else {
                                    this.content = Utils.flattenContent(response.data.results);
                                }
                                this.page = Number(response.data.page);
                                this.total_pages = Math.ceil(response.data.total_results / this.$_limit);
                            }

                            this.loading = false;
                        })
                        .catch(error => {
                            console.error(error);
                        })
                }
            },

            infiniteScrollEventHandler(){
                let scroll_position = window.pageYOffset + window.innerHeight;
                let scroll_buffer = document.body.scrollHeight - 50;

                if(scroll_position >= scroll_buffer){
                    if(!this.loading){
                        this.page += 1;
                    }

                    this.getContent();
                }
            },

            handlePageChange(payload){
                this.page = payload.page;

                this.getContent();
            }
        },
        mounted(){
            if(!this.$_pre_loaded_content.length){
                this.getContent();
            }

            if(this.$_infinite_scroll && !this.$_load_more_button){
                window.addEventListener('scroll', this.infiniteScrollEventHandler);
            }
        },
        beforeDestroy(){
            if(this.$_infinite_scroll && !this.$_load_more_button){
                window.removeEventListener('scroll', this.infiniteScrollEventHandler);
            }
        }
    }
</script>