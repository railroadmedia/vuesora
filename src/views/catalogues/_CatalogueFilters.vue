<template>
    <div class="flex flex-row flex-wrap pb">
        <catalogue-filter v-for="item in $_filterableValues"
                          v-if="item !== 'progress'"
                          :key="item.key"
                          :$_filter_name="item"
                          :$_item="$_filters[item]"
                          :$_themeColor="$_themeColor"
                          :loading="loading"
                          :$_initial_value="filter_params[item]"
                          @filterChange="handleFilterChange"></catalogue-filter>

        <catalogue-filter v-if="hasProgressFilter"
                          $_filter_name="progress"
                          :$_item="progress_options"
                          :$_themeColor="$_themeColor"
                          :loading="loading"
                          :$_initial_value="$_user_state"
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
            },
            required_user_states: {
                type: Array,
                default: () => []
            },
            filter_params: {
                type: Object,
                default(){
                    return {
                        artist: null,
                        bpm: null,
                        difficulty: null,
                        instructor: null,
                        style: null,
                        topic: null
                    }
                }
            }
        },
        data(){
            return {
                progress_options: [
                    { key: 'started', value: "started" },
                    { key: 'completed', value: "completed" },
                ]
            }
        },
        computed: {
            $_user_state(){
                return this.required_user_states.length ? this.required_user_states[0] : null
            },

            hasProgressFilter(){
                return this.$_filterableValues.indexOf('progress') !== -1;
            }
        },
        methods: {

            handleFilterChange(payload){
                this.$emit('filterChange', payload);
            },

            handleProgressChange(payload){
                this.$emit('progressChange', {
                    type: payload.value,
                })
            }
        }
    }
</script>