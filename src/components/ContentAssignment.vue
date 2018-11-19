<template>
    <div class="flex flex-column bb-light-1">
        <div class="flex flex-row pointer align-v-center pa-2"
             @click="accordionActive = !accordionActive">
            <div class="flex flex-column arrow-column">
                <button class="btn collapse-square">
                    <span class="bg-grey-2"
                          :class="accordionActive ? 'inverted text-grey-2' : 'text-white'">
                        <i class="fas"
                           :class="accordionActive ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                    </span>
                </button>
            </div>
            <div class="flex flex-column grow">
                <h3 class="title">{{ title }}</h3>
            </div>
            <div class="flex flex-column flex-auto complete-column">
                <button class="btn"
                        @click.stop="markAsComplete">
                    <span class="bg-drumeo"
                          :class="isComplete ? 'text-white' : 'inverted text-drumeo'">
                        <i class="fas fa-check mr-1"></i>
                        <span class="hide-xs-only">
                            {{ isComplete ? 'Completed' : 'Complete' }}&nbsp;
                        </span> - 10 XP
                    </span>
                </button>
            </div>
        </div>
        <transition name="slide-down-fade">
            <div v-show="accordionActive"
                 class="flex flex-row">
                <div class="flex flex-column ph pa-3">
                    <transition name="show-from-bottom">
                        <div id="practiceOverlay" class="bg-white" v-if="open">
                            <div class="flex flex-row align-v-center bb-grey-4-1 bg-grey-5 ph">
                                <h2 class="title text-white grow pv-1">{{ title }}</h2>

                                <div class="close-exercise tiny uppercase text-white flex-auto align-v-center pv-1 pointer"
                                     @click="closeExercise">
                                    Close <i class="fas fa-times"></i>
                                </div>
                            </div>

                            <iframe id="ssEmbed"
                                    :src="'https://www.soundslice.com/scores/' + soundsliceSlug + '/embed/?api=1&scroll_type=2&branding=0&enable_mixer=0'" frameBorder="0" allowfullscreen
                                    @load="loading = false"></iframe>

                            <div class="loading-exercise heading bg-white corners-3 shadow ph-4 pv-2"
                                 v-if="loading">
                                <i class="fas fa-spinner fa-spin"
                                   :class="'text-' + themeColor"></i>
                            </div>
                        </div>
                    </transition>

                    <div class="flex flex-row mb align-v-top flex-wrap">
                        <div class="flex flex-column mb-1 xs-12"
                             :class="titleStyle === 'center' ? 'text-center' : 'sm-9'">
                            <!--<h3 class="title mb-1">{{ title }}</h3>-->
                            <p class="body">{{ description }}</p>
                        </div>
                        <div class="flex flex-column practice-column xs-12 mb-1"
                             :class="titleStyle === 'center' ? 'align-h-center' : 'sm-3'"
                             v-if="soundsliceSlug">
                            <button class="btn"
                                    :class="titleStyle === 'center' ? 'collapse-200' : ''"
                                    @click="openExercise">
                        <span class="text-white short" :class="'bg-' + themeColor">
                            <i class="fas fa-play-circle mr-1"></i> Practice
                        </span>
                            </button>
                        </div>
                    </div>
                    <div class="flex flex-row carousel overflow mv pb-3"
                         ref="carouselContainer"
                         v-if="totalPages > 0">

                        <div class="flex flex-column xs-12 grow page"
                             v-for="(page, i) in pages"
                             :key="'page' + (i + 1)"
                             :style="pageScrollPosition">
                            <img :src="page" class="ph-3">
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

                        <div class="page-buttons" v-if="totalPages > 1">
                            <div v-for="(page, i) in pages"
                                 class="page-button mh-1 rounded bg-black"
                                 :class="currentPageClass(i + 1)"
                                 @click="scrollToPage(i + 1)"
                                 :key="'pageButton' + (i + 1)"></div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    export default {
        name: 'content-assignment',
        props: {
            brand: {
                type: String,
                default: () => 'recordeo'
            },
            themeColor: {
                type: String,
                default: () => 'drumeo'
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
            },
            soundsliceSlug: {
                type: String,
                default: () => ''
            },
            titleStyle: {
                type: String,
                default: () => 'left'
            },
            completed: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                currentPage: 1,
                totalPages: this.pages.length || 0,
                scrollAmount: 0,
                open: false,
                loading: true,
                isPlaying: false,
                accordionActive: false,
                isComplete: this.completed
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

            spacebarToPlayPause(event){
                const embeddedPlayer = document.getElementById('ssEmbed').contentWindow;

                if(event.keyCode === 32){
                    event.preventDefault();

                    if(this.isPlaying){
                        embeddedPlayer.postMessage('{"method": "pause"}', 'https://www.soundslice.com');
                    }
                    else {
                        embeddedPlayer.postMessage('{"method": "play"}', 'https://www.soundslice.com');
                    }
                }
            },

            openExercise(){
                this.open = true;
                document.body.classList.add('no-scroll');

                document.addEventListener('keyup', this.spacebarToPlayPause);
            },

            closeExercise(){
                this.loading = true;
                this.open = false;
                document.body.classList.remove('no-scroll');

                document.removeEventListener('keyup', this.spacebarToPlayPause);
            },

            markAsComplete(){
                this.isComplete = !this.isComplete;
            }
        },
        computed: {
            pageScrollPosition(){
                return "transform:translateX(-" + (this.scrollAmount * (this.currentPage - 1)) + "px)";
            }
        },
        mounted(){
            if(this.pages.length){
                this.scrollAmount = this.$refs.carouselContainer.clientWidth;
            }

            window.addEventListener('resize', this.scrollAmountChange);
            window.addEventListener('message', event => {
                if(event.origin === "https://www.soundslice.com"){
                    var cmd = JSON.parse(event.data);

                    switch (cmd.method) {
                        case 'ssPlay':
                            this.isPlaying = true;
                            break;
                        case 'ssPause':
                            this.isPlaying = false;
                            break;
                    }
                }
            });
        },
        beforeDestroy(){
            window.removeEventListener('resize', this.scrollAmountChange);
        }
    }
</script>
<style lang="scss">
    @import '../assets/sass/partials/_variables.scss';

    .arrow-column {
        display:none;

        @include small {
            display:flex;
            flex:0 0 60px;
            padding-right:10px;
        }

    }

    .complete-column {
        flex:0 0 100px;

        @include small {
            flex:0 0 200px;
        }
    }

    #practiceOverlay {
        position:fixed;
        top:50px;
        left:0;
        right:0;
        bottom:0;
        z-index:97;

        @include large {
            top:65px;
        }

        .loading-exercise {
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%, -50%);
        }
    }

    #ssEmbed {
        position:absolute;
        left:0;
        bottom:0;
        width:100%;
        height:calc(100% - 50px);
    }

    .carousel {
        position:relative;

        .page {
            transform:translateX(0);
            will-change:transform;
            transition:transform .4s ease-in-out;

            img {
                width:100%;
            }
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
            white-space:nowrap;

            .page-button {
                height:12px;
                width:12px;
                display:inline-block;
                border-width:2px;
                cursor:pointer;
            }
        }
    }
</style>