<template>
    <div class="flex flex-row flex-wrap">
        <div class="flex flex-column xs-12 sm-8 pa-1">
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

        <div class="flex flex-column xs-12 sm-4 pv-1">
            <catalogue-filter $_filter_name="type"
                              :$_item="parsedTypes"
                              :$_themeColor="$_themeColor"
                              :loading="loading"
                              :$_initial_value="$_selected_types"
                              @filterChange="changeFilter"></catalogue-filter>
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
            $_themeColor: {
                type: String,
                default: () => ''
            },
            loading: {
                type: Boolean,
                default: () => false
            },
            $_included_types: {
                type: Array,
                default: () => []
            },
            $_selected_types: {
                type: String,
                default: () => null
            },
            $_search_term: {
                type: String,
                default: () => undefined
            }
        },
        computed: {
            searchTermInterface: {
                get(){
                    return this.$_search_term;
                },
                set(value){
                    if(value){
                        this.$emit('searchChange', {
                            term: value
                        })
                    }
                }
            },
            parsedTypes(){
                let parsedArray = [];

                this.$_included_types.forEach(type => {
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