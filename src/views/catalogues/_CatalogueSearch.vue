<template>
    <div class="flex flex-column">
        <div class="flex flex-row flex-wrap">
            <div class="flex flex-column xs-12 pa-1"
                 :class="included_types.length ? 'sm-8' : ''">
                <div class="form-group">
                    <input type="text"
                           id="catalogueSearch"
                           name="search"
                           autocomplete="off"
                           placeholder="Search..."
                           class="no-label"
                           v-model.lazy="searchTermInterface">
                </div>
            </div>

            <div class="flex flex-column xs-12 sm-4 pv-1" v-if="included_types.length">
                <catalogue-filter filter_name="type"
                                  :item="parsedTypes"
                                  :themeColor="themeColor"
                                  :loading="loading"
                                  :initial_value="selected_types"
                                  @filterChange="changeFilter"></catalogue-filter>
            </div>
        </div>
        <div class="flex flex-row ph-1 pb-1">
            <p class="tiny text-grey-3 font-italic">
                Displaying <span v-if="total_results > 0">{{ currentResults }} of</span> {{ total_results }} results.
            </p>
        </div>
    </div>
</template>
<script>
    import CatalogueFilter from './_CatalogueFilter.vue';

    export default {
        name: 'catalogue-search',
        components: {
            'catalogue-filter': CatalogueFilter
        },
        props: {
            themeColor: {
                type: String,
                default: () => ''
            },
            loading: {
                type: Boolean,
                default: () => false
            },
            included_types: {
                type: Array,
                default: () => []
            },
            selected_types: {
                type: String,
                default: () => null
            },
            search_term: {
                type: String,
                default: () => undefined
            },
            current_page: {
                type: String|Number,
                default: () => 1
            },
            limit: {
                type: String|Number,
                default: () => 20
            },
            total_results: {
                type: String|Number,
                default: () => 0
            }
        },
        computed: {
            searchTermInterface: {
                get(){
                    return this.search_term;
                },
                set(value){
                    if(value){
                        this.$emit('searchChange', {
                            term: value
                        })
                    }
                }
            },

            currentResults(){
                return (1 + ((this.current_page * this.limit) - this.limit)) + '-' + this.displayedLimit;
            },

            displayedLimit(){
                return this.limit > this.total_results ? this.total_results : this.limit;
            },

            parsedTypes(){
                let parsedArray = [];

                this.included_types.forEach(type => {
                    parsedArray.push({
                        key: type,
                        value: type
                    });
                });

                return parsedArray;
            }
        },
        methods: {
            changeFilter(item){
                this.$emit('typeChange', {
                    key: item.key,
                    value: item.value
                })
            }
        }
    }
</script>