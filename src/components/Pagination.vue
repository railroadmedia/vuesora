<template>
    <div class="flex flex-row pagination align-center">
        <button
            v-show="currentPage > 1"
            class="btn short collapse-square page-button"
            @click="goToPage(currentPage - 1)"
        >
            <span class="bg-grey-3 inverted text-grey-3">
                <i class="fas fa-chevron-left"></i>
            </span>
        </button>

        <button
            v-show="currentPage > 2"
            class="btn short collapse-square page-button"
            @click="goToPage(1)"
        >
            <span class="bg-grey-3 inverted text-grey-3">
                1
            </span>
        </button>

        <button
            v-show="currentPage > 3"
            disabled
            class="btn short collapse-square page-button"
        >
            <span class="bg-grey-3 inverted text-grey-3">
                ...
            </span>
        </button>

        <button
            v-for="i in totalPages"
            v-show="i < (currentPage + 2) && i > (currentPage - 2)"
            :key="`page-${i}`"
            class="btn short collapse-square page-button"
            @click="goToPage(i)"
        >
            <span class="bg-grey-3"
                  :class="currentPage === i ? 'text-white active' : 'inverted text-grey-3'">
                {{ i }}
            </span>
        </button>

        <button
            v-show="currentPage < totalPages - 2"
            disabled
            class="btn short collapse-square page-button"
        >
            <span class="bg-grey-3 inverted text-grey-3">
                ...
            </span>
        </button>

        <button
            v-show="currentPage < totalPages - 1"
            class="btn short collapse-square page-button"
            @click="goToPage(totalPages)"
        >
            <span class="bg-grey-3 inverted text-grey-3">
                {{ totalPages }}
            </span>
        </button>

        <button
            v-show="currentPage < totalPages"
            class="btn short collapse-square page-button"
            @click="goToPage(currentPage + 1)"
        >
            <span class="bg-grey-3 inverted text-grey-3">
                <i class="fas fa-chevron-right"></i>
            </span>
        </button>
    </div>
</template>
<script>

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
    methods: {
        goToPage(page) {
            this.$emit('pageChange', {
                page,
            });
        },
    },
};
</script>
<style lang="scss">
    .page-button {
        margin:0 3px;
    }
</style>
