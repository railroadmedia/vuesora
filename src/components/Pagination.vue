<template>
    <div class="flex flex-row pagination align-center">
        <button
            v-show="currentPage > 1"
            class="btn short collapse-square page-button"
            @click="goToPage(currentPage - 1)"
        >
            <span
                class="bg-grey-3 flat"
                :class="themeTextClass"
            >
                <i class="far fa-chevron-left"></i>
            </span>
        </button>

        <button
            v-show="currentPage > 2"
            class="btn short collapse-square page-button"
            @click="goToPage(1)"
        >
            <span
                class="flat"
                :class="[themeTextClass, themeBgClass]">
                1
            </span>
        </button>

        <button
            v-show="currentPage > 3"
            disabled
            class="btn short collapse-square page-button"
        >
            <span
                class="flat"
                :class="[themeTextClass, themeBgClass]"
            >
                ...
            </span>
        </button>

        <button
            v-for="i in activePages"
            :key="`page-${i}`"
            class="btn short collapse-square page-button"
            @click="goToPage(i)"
        >
            <span
                :class="currentPage === i ? activeClasses : inactiveClasses"
            >
                {{ i }}
            </span>
        </button>

        <button
            v-show="currentPage < totalPages - 2"
            disabled
            class="btn short collapse-square page-button"
        >
            <span
                class="flat"
                :class="[themeTextClass, themeBgClass]"
            >
                ...
            </span>
        </button>

        <button
            v-show="currentPage < totalPages - 1"
            class="btn short collapse-square page-button"
            @click="goToPage(totalPages)"
        >
            <span
                class="flat"
                :class="[themeTextClass, themeBgClass]"
            >
                {{ totalPages }}
            </span>
        </button>

        <button
            v-show="currentPage < totalPages"
            class="btn short collapse-square page-button"
            @click="goToPage(currentPage + 1)"
        >
            <span
                class="flat"
                :class="[themeTextClass, themeBgClass]"
            >
                <i class="far fa-chevron-right"></i>
            </span>
        </button>
    </div>
</template>
<script>
import ThemeClasses from '../mixins/ThemeClasses';
import { Utils } from '@musora/helper-functions';

export default {
    name: 'Pagination',
    mixins: [ThemeClasses],
    props: {
        currentPage: {
            type: Number,
            default: () => 1,
        },
        totalPages: {
            type: Number,
            default: () => 0,
        },
        themeColor: {
            type: String,
            default: 'grey-3',
        },
    },
    computed: {
        activeClasses() {
            return ['text-white', this.themeBgClass];
        },

        inactiveClasses() {
            return [this.themeTextClass, 'flat'];
        },

        activePages() {
            const pages = this.range(this.totalPages, 1);

            return pages.filter(page => page < (this.currentPage + 2) && page > (this.currentPage - 2));
        },
    },
    methods: {
        goToPage(page) {
            this.$emit('pageChange', {
                page,
            });
        },

        range: (length, start) => Utils.range(length, start),
    },
};
</script>
<style lang="scss">
    button.btn.page-button {
        margin:0 3px;

        & > span {
            border-width:1px;
            font-weight:500;
        }
    }
</style>
