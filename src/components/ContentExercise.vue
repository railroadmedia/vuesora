<template>
    <div class="flex flex-column">
        <div class="flex flex-row mb">
            <div class="flex flex-column align-v-center">
                <h3 class="title">{{ title }}</h3>
            </div>
            <div class="flex flex-column practice-column">
                <button class="btn">
                    <span class="text-white short" :class="'bg-' + brand">
                        <i class="fas fa-play-circle mr-1"></i> Practice
                    </span>
                </button>
            </div>
        </div>
        <div class="flex flex-row">
            <p class="body">{{ description }}</p>
        </div>
        <div class="flex flex-row carousel overflow pb-3"
             ref="carouselContainer"
             v-if="totalPages > 0">

            <div class="flex flex-column xs-12 page ph-3"
                 v-for="(page, i) in pages"
                 :key="'page' + (i + 1)"
                 :style="pageScrollPosition">
                <img :src="page">
            </div>

            <div class="side-button prev flex-center"
                 v-if="currentPage > 1"
                 @click="scrollToPage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
            </div>
            <div class="side-button next flex-center"
                 v-if="currentPage < totalPages"
                 @click="scrollToPage(currentPage + 1)">
                <i class="fas fa-chevron-right"></i>
            </div>

            <div class="page-buttons">
                <div v-for="(page, i) in pages"
                     class="page-button mh-1 rounded bg-black"
                     :class="currentPageClass(i + 1)"
                     @click="scrollToPage(i + 1)"
                     :key="'pageButton' + (i + 1)"></div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'content-exercise',
        props: {
            brand: {
                type: String,
                default: () => 'recordeo'
            },
            title: {
                type: String,
                default: () => ''
            },
            id: {
                type: Number,
                default: () => 123
            },
            description: {
                type: String,
                default: () => ''
            },
            pages: {
                type: Array,
                default: () => []
            }
        },
        data(){
            return {
                currentPage: 1,
                totalPages: this.pages.length || 0,
                scrollAmount: 0
            }
        },
        methods: {
            scrollToPage(page){
                this.currentPage = page;
            },

            scrollAmountChange(){
                this.scrollAmount = this.$refs.carouselContainer.clientWidth;
            },

            currentPageClass(page){
                return page !== this.currentPage ? 'inverted' : '';
            },
        },
        computed: {
            pageScrollPosition(){
                return "transform:translateX(-" + (this.scrollAmount * (this.currentPage - 1)) + "px)";
            }
        },
        mounted(){
            this.scrollAmount = this.$refs.carouselContainer.clientWidth;
            window.addEventListener('resize', this.scrollAmountChange);
        },
        beforeDestroy(){
            window.removeEventListener('resize', this.scrollAmountChange);
        }
    }
</script>
<style lang="scss">
    @import '../assets/sass/partials/_variables.scss';

    .practice-column {
        flex:0 0 150px;
    }

    .carousel {
        position:relative;

        .page {
            transform:translateX(0);
            will-change:transform;
            transition:transform .4s ease-in-out;
        }

        .side-button {
            position:absolute;
            top:0;
            height:100%;
            background-color:transparent;
            will-change:background-color;
            transition:background-color .2s ease-in-out;
            cursor:pointer;
            width:$gutterWidth;

            i {
                font-size:20px;
            }

            &:hover {
                background-color:#f2f2f2;
            }

            &.prev {
                left:0;
            }

            &.next {
                right:0;
            }
        }

        .page-buttons {
            position:absolute;
            bottom:0;
            left:50%;
            transform:translateX(-50%);

            .page-button {
                height:15px;
                width:15px;
                display:inline-block;
                border-width:2px;
                cursor:pointer;
            }
        }
    }
</style>