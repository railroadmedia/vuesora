<template>
    <div class="flex flex-row flex-wrap ph pv-3 filter-tabs">
        <div class="heading pointer mr-3 flex"
             v-for="(item, i) in $_filters"
             :class="$_selected_tab === item.value ? 'text-black' : 'text-grey-2 font-regular'"
             @click="changeFilter(item)">
            {{ item.title }}
        </div>
    </div>
</template>
<script>

    export default {
        name: 'cataloge-table-filters',
        props: {
            $_filters: {
                type: Array,
                default: () => []
            },
            $_selected_tab: null
        },
        methods: {
            changeFilter(item){
                this.$emit('filterChange', {
                    key: item.key,
                    value: item.value
                })
            }
        }
    }
</script>