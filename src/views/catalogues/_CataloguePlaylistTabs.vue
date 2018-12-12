<template>
    <div class="flex flex-row flex-wrap align-v-center">
        <div class="flex flex-column xs-12 sm-8 pv-3">
            <div class="flex flex-row flex-wrap filter-tabs ph align-v-center">
                <div class="heading-tab pointer mr-3 flex flex-auto"
                     @click="changeTab('added')">
                    <h3 class="heading flex-auto hover-text-black"
                        :class="selected_tab === 'added' ? ('text-black bb-' + $_themeColor + '-2') : 'text-grey-3 font-regular'">
                        Added
                    </h3>
                </div>

                <div class="heading-tab pointer mr-3 flex flex-auto"
                     @click="changeTab('started')">
                    <h3 class="heading flex-auto hover-text-black"
                        :class="selected_tab === 'started' ? ('text-black bb-' + $_themeColor + '-2') : 'text-grey-3 font-regular'">
                        In Progress
                    </h3>
                </div>

                <div class="heading-tab pointer mr-3 flex flex-auto"
                     @click="changeTab('completed')">
                    <h3 class="heading flex-auto hover-text-black"
                        :class="selected_tab === 'completed' ? ('text-black bb-' + $_themeColor + '-2') : 'text-grey-3 font-regular'">
                        Complete
                    </h3>
                </div>



                <!--<h2 class="heading mh pointer"-->
                    <!--:class="selected_tab === 'added' ? 'text-black bb-' + $_themeColor + '-2' : 'text-grey-2'"-->
                    <!--@click="changeTab('added')">Added</h2>-->
                <!--<h2 class="heading mh pointer"-->
                    <!--:class="selected_tab === 'started' ? 'text-black bb-' + $_themeColor + '-2' : 'text-grey-2'"-->
                    <!--@click="changeTab('started')">In Progress</h2>-->
                <!--<h2 class="heading mh pointer"-->
                    <!--:class="selected_tab === 'completed' ? 'text-black bb-' + $_themeColor + '-2' : 'text-grey-2'"-->
                    <!--@click="changeTab('completed')">Completed</h2>-->
            </div>
        </div>

        <div class="flex flex-column xs-12 sm-4 pv-1 align-v-center">
            <div class="flex flex-row">
                <catalogue-filter $_filter_name="type"
                                  :$_item="parsedTypes"
                                  :$_themeColor="$_themeColor"
                                  :loading="loading"
                                  :$_initial_value="selected_types"
                                  @filterChange="changeFilter"></catalogue-filter>
            </div>
        </div>
    </div>
</template>
<script>
    import CatalogueFilter from './_CatalogueFilter.vue';
    import * as QueryString from 'query-string';

    export default {
        name: 'catalogue-playlist-tabs',
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
            $_search_term: {
                type: String,
                default: () => undefined
            }
        },
        data(){
            return {
                selected_types: null,
                selected_tab: 'added'
            }
        },
        computed: {
            searchTermInterface: {
                get(){
                    return this.$_search_term;
                },
                set(value){
                    this.$emit('searchChange', {
                        term: value
                    })
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
                const params = window.location.search;
                const query_object = QueryString.parse(params, {arrayFormat: 'bracket'});

                console.log(item.value);

                if(item.value){
                    query_object['type'] = item.value;
                }
                else {
                    if(query_object['type']){
                        delete query_object['type'];
                    }
                }

                window.location.href = location.protocol + '//' + location.host +
                    location.pathname + '?' + QueryString.stringify(query_object);
            },

            changeTab(tab){
                const params = window.location.search;
                const query_object = QueryString.parse(params, {arrayFormat: 'bracket'});

                if(tab !== 'added'){
                    query_object['state'] = tab;
                }
                else {
                    if(query_object['state']){
                        delete query_object['state'];
                    }
                }

                window.location.href = location.protocol + '//' + location.host +
                    location.pathname + '?' + QueryString.stringify(query_object);
            },
        },
        mounted(){
            const params = window.location.search;
            const query_object = QueryString.parse(params, {arrayFormat: 'bracket'});
            const keys = Object.keys(query_object);

            keys.forEach(key => {

                if (key === 'type') {
                    if(this.$_included_types.indexOf(query_object[key]) !== -1){
                        this.selected_types = query_object[key];
                    }
                }

                if(key === 'state'){
                    if(query_object[key] === 'started'){
                        this.selected_tab = 'started';
                    }

                    if(query_object[key] === 'completed'){
                        this.selected_tab = 'completed';
                    }
                }
            });
        }
    }
</script>