<template>
    <div class="flex flex-row pv">
        <catalogue-filter v-for="item in $_filterableValues"
                          :key="item.key"
                          :$_filter_name="item"
                          :$_item="$_filters[item]"
                          :$_themeColor="$_themeColor"
                          @filterChange="handleFilterChange"></catalogue-filter>
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
                }
            }
        },
        methods: {

            handleFilterChange(payload){
                this.filter_params[payload.key] = payload.value;

                this.$emit('filterChange', this.filter_params);
            }
        }
    }
</script>