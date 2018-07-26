<template>
    <div class="flex flex-row flex-wrap pv">
        <catalogue-filter v-for="item in $_filterableValues"
                          v-if="item !== 'progress'"
                          :key="item.key"
                          :$_filter_name="item"
                          :$_item="$_filters[item]"
                          :$_themeColor="$_themeColor"
                          :loading="loading"
                          @filterChange="handleFilterChange"></catalogue-filter>

        <catalogue-filter v-if="hasProgressFilter"
                          $_filter_name="progress"
                          :$_item="progress_options"
                          :$_themeColor="$_themeColor"
                          :loading="loading"
                          @filterChange="handleProgressChange"></catalogue-filter>
    </div>
</template>
<script>
    import CatalogueFilter from './_CatalogueFilter.vue';

    export default {
        name: 'catalogue-filters',
        components: {
            'catalogue-filter': CatalogueFilter
        },
        props: {
            loading: {
                type: Boolean,
                default: () => false
            },
            $_filters: {
                type: Object
            },
            $_filterableValues: {
                type: Array,
                default: () => []
            },
            $_themeColor: {
                type: String,
                default: () => 'drumeo'
            }
        },
        data(){
            return {
                filter_params: {
                    artist: null,
                    bpm: null,
                    difficulty: null,
                    instructor: null,
                    style: null,
                    topic: null
                },
                progress_options: [
                    { key: 'started', value: "started" },
                    { key: 'completed', value: "completed" },
                ]
            }
        },
        computed: {
            hasProgressFilter(){
                return this.$_filterableValues.indexOf('progress') !== -1;
            }
        },
        methods: {

            handleFilterChange(payload){
                this.filter_params[payload.key] = payload.value;

                this.$emit('filterChange', this.filter_params);
            },

            handleProgressChange(payload){
                this.$emit('progressChange', {
                    type: payload.value,
                })
            }
        }
    }
</script>