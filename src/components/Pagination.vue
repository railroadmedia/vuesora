<template>
    <div class="flex flex-row pagination align-center">
        <div
            v-if="currentPage > 1"
            class="tiny corners-3 page-button flex-center shadow noselect bg-white text-grey-3 hide-xs-only"
            @click="goToPage(currentPage - 1)"
        >
            <i class="fal fa-chevron-left"></i>
        </div>

        <div
            v-if="currentPage > 2"
            class="tiny corners-3 page-button flex-center shadow noselect bg-white text-grey-3"
            @click="goToPage(1)"
        >
            1
        </div>

        <div
            v-if="currentPage > 3"
            class="tiny corners-3 page-button flex-center shadow noselect bg-white text-grey-3 filler font-light"
        >
            ...
        </div>

        <div
            v-for="i in totalPages"
            v-if="i < (currentPage + 2) && i > (currentPage - 2)"
            class="tiny corners-3 page-button flex-center shadow noselect"
            :class="currentPage === i ? 'bg-x-dark text-white active' : 'bg-white text-grey-3'"
            @click="goToPage(i)"
        >
            {{ i }}
        </div>

        <div
            v-if="currentPage < totalPages - 2"
            class="tiny corners-3 page-button flex-center shadow noselect bg-white text-grey-3 filler font-light"
        >
            ...
        </div>

        <div
            v-if="currentPage < totalPages - 1"
            class="tiny corners-3 page-button flex-center shadow noselect bg-white text-grey-3"
            @click="goToPage(totalPages)"
        >
            {{ totalPages }}
        </div>

        <div
            v-if="currentPage < totalPages"
            class="tiny corners-3 page-button flex-center shadow noselect bg-white text-grey-3 hide-xs-only"
            @click="goToPage(currentPage + 1)"
        >
            <i class="fal fa-chevron-right"></i>
        </div>
    </div>
</template>
<script>
import { Utils } from '@musora/helper-functions';

export default {
    name: 'Pagination',
    props: {
        currentPage: {
            type: Number,
            default: () => 1,
        },
        totalPages: {
            type: Number,
            default: () => 0,
        },
    },
    computed: {
        activePages() {
            // TODO: I haven't tested this, but it should work. Instead of using v-if with v-for
            const pages = this.range(this.totalPages, 1);

            return pages.filter(page =>
                page < (this.currentPage + 2)
                && page > (this.currentPage - 2)
            );
        },
    },
    methods: {
        goToPage(page) {
            this.$emit('pageChange', {
                page,
            });
        },

        range: (length, start) => Utils.range(length, start)
    },
};
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

        &.filler, &.active {
            pointer-events:none;
        }
    }
</style>
