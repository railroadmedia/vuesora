<template>
    <div class="flex flex-row flex-wrap align-v-center">
        <div class="flex flex-column xs-12 sm-8 pv-3">
            <div class="flex flex-row flex-wrap filter-tabs ph align-v-center">
                <div
                    class="heading-tab pointer mr-3 flex flex-auto"
                    @click="changeTab('added')"
                >
                    <h3
                        class="heading flex-auto hover-text-black"
                        :class="selected_tab === 'added' ? ('text-black bb-' + themeColor + '-2') : 'text-grey-3 font-regular'"
                    >
                        Added
                    </h3>
                </div>

                <div
                    class="heading-tab pointer mr-3 flex flex-auto"
                    @click="changeTab('started')"
                >
                    <h3
                        class="heading flex-auto hover-text-black"
                        :class="selected_tab === 'started' ? ('text-black bb-' + themeColor + '-2') : 'text-grey-3 font-regular'"
                    >
                        In Progress
                    </h3>
                </div>

                <div
                    class="heading-tab pointer mr-3 flex flex-auto"
                    @click="changeTab('completed')"
                >
                    <h3
                        class="heading flex-auto hover-text-black"
                        :class="selected_tab === 'completed' ? ('text-black bb-' + themeColor + '-2') : 'text-grey-3 font-regular'"
                    >
                        Complete
                    </h3>
                </div>


                <!--<h2 class="heading mh pointer"-->
                <!--:class="selected_tab === 'added' ? 'text-black bb-' + themeColor + '-2' : 'text-grey-2'"-->
                <!--@click="changeTab('added')">Added</h2>-->
                <!--<h2 class="heading mh pointer"-->
                <!--:class="selected_tab === 'started' ? 'text-black bb-' + themeColor + '-2' : 'text-grey-2'"-->
                <!--@click="changeTab('started')">In Progress</h2>-->
                <!--<h2 class="heading mh pointer"-->
                <!--:class="selected_tab === 'completed' ? 'text-black bb-' + themeColor + '-2' : 'text-grey-2'"-->
                <!--@click="changeTab('completed')">Completed</h2>-->
            </div>
        </div>

        <div class="flex flex-column xs-12 sm-4 pv-1 align-v-center">
            <div class="flex flex-row">
                <catalogue-filter
                    filter_name="type"
                    :item="parsedTypes"
                    :theme-color="themeColor"
                    :loading="loading"
                    :initial_value="selected_types"
                    @filterChange="changeFilter"
                ></catalogue-filter>
            </div>
        </div>
    </div>
</template>
<script>
import * as QueryString from 'query-string';
import CatalogueFilter from './_CatalogueFilter.vue';

export default {
    name: 'CataloguePlaylistTabs',
    components: {
        'catalogue-filter': CatalogueFilter,
    },
    props: {
        themeColor: {
            type: String,
            default: () => '',
        },
        loading: {
            type: Boolean,
            default: () => false,
        },
        includedTypes: {
            type: Array,
            default: () => [],
        },
        searchTerm: {
            type: String,
            default: () => undefined,
        },
    },
    data() {
        return {
            selected_types: null,
            selected_tab: 'added',
        };
    },
    computed: {
        searchTermInterface: {
            get() {
                return this.search_term;
            },
            set(value) {
                this.$emit('searchChange', {
                    term: value,
                });
            },
        },
        parsedTypes() {
            const parsedArray = [];

            this.included_types.forEach((type) => {
                parsedArray.push({
                    key: type,
                    value: type,
                });
            });

            return parsedArray;
        },
    },
    mounted() {
        const params = window.location.search;
        const query_object = QueryString.parse(params, { arrayFormat: 'bracket' });
        const keys = Object.keys(query_object);

        keys.forEach((key) => {
            if (key === 'type') {
                if (this.included_types.indexOf(query_object[key]) !== -1) {
                    this.selected_types = query_object[key];
                }
            }

            if (key === 'state') {
                if (query_object[key] === 'started') {
                    this.selected_tab = 'started';
                }

                if (query_object[key] === 'completed') {
                    this.selected_tab = 'completed';
                }
            }
        });
    },
    methods: {
        changeFilter(item) {
            const params = window.location.search;
            const query_object = QueryString.parse(params, { arrayFormat: 'bracket' });

            console.log(item.value);

            if (item.value) {
                query_object.type = item.value;
            } else if (query_object.type) {
                delete query_object.type;
            }

            window.location.href = `${location.protocol}//${location.host 
            }${location.pathname}?${QueryString.stringify(query_object)}`;
        },

        changeTab(tab) {
            const params = window.location.search;
            const query_object = QueryString.parse(params, { arrayFormat: 'bracket' });

            if (tab !== 'added') {
                query_object.state = tab;
            } else if (query_object.state) {
                delete query_object.state;
            }

            window.location.href = `${location.protocol}//${location.host 
            }${location.pathname}?${QueryString.stringify(query_object)}`;
        },
    },
};
</script>
