<template>
    <div class="flex flex-row pagination align-center">
        <div v-if="currentPage > 1"
             class="tiny corners-3 page-button flex-center shadow noselect bg-white text-dark hide-xs-only"
             @click="goToPage(currentPage - 1)">
            <i class="fal fa-chevron-left"></i>
        </div>

        <div v-if="currentPage > 2"
             class="tiny corners-3 page-button flex-center shadow noselect bg-white text-dark"
             @click="goToPage(1)">
            1
        </div>

        <div v-if="currentPage > 3"
             class="tiny corners-3 page-button flex-center shadow noselect bg-white text-dark filler font-light">
            ...
        </div>

        <div v-for="i in totalPages"
             v-if="i < (currentPage + 2) && i > (currentPage - 2)"
             class="tiny corners-3 page-button flex-center shadow noselect"
             :class="currentPage === i ? brandBgClass + ' text-white' : 'bg-white text-dark'"
             @click="goToPage(i)">
            {{ i }}
        </div>

        <div v-if="currentPage < totalPages - 2"
             class="tiny corners-3 page-button flex-center shadow noselect bg-white text-dark filler font-light">
            ...
        </div>

        <div v-if="currentPage < totalPages - 1"
             class="tiny corners-3 page-button flex-center shadow noselect bg-white text-dark"
             @click="goToPage(totalPages)">
            {{ totalPages }}
        </div>

        <div v-if="currentPage < totalPages"
             class="tiny corners-3 page-button flex-center shadow noselect bg-white text-dark hide-xs-only"
             @click="goToPage(currentPage + 1)">
            <i class="fal fa-chevron-right"></i>
        </div>
    </div>
</template>
<script>
    import BrandClasses from '../mixins/BrandClasses'

    export default {
        mixins: [BrandClasses],
        name: 'pagination',
        props: {
            currentPage: {
                type: Number,
                default: () => 1
            },
            totalPages: {
                type: Number,
                default: () => 0
            }
        },
        methods: {
            goToPage(page){
                this.$emit('pageChange', {
                    page: page
                })
            }
        }
    }
</script>
<style lang="scss">
    .pagination {
        height:30px;
    }
    .page-button {
        min-width:30px;
        width:30px;
        min-height:30px;
        height:30px;
        margin:0 3px;
        cursor:pointer;

        &.filler {
            pointer-events:none;
        }
    }
</style>