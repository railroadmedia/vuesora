<template>
    <div class="flex flex-column bb-light-1">
        <div class="flex flex-row align-v-center flex-wrap pa-2">
            <div class="flex flex-column xs-12 md-8">
                <div class="flex flex-row align-v-center">
                    <div class="flex flex-column arrow-column hide-xs-only">
                        <button class="btn collapse-square"
                                @click="openAssignment">
                            <span class="bg-grey-3"
                                  :class="accordionButtonClasses">
                                <i class="fas"
                                   :class="accordionButtonIconClasses"></i>
                            </span>
                        </button>

                    </div>
                    <div class="flex flex-column">
                        <div class="flex flex-row align-v-center">
                            <div class="flex flex-column pointer"
                                 @click="openAssignment">
                                <h3 class="title noselect">{{ title }}</h3>
                            </div>
                            <div v-if="timecode != 0"
                                 class="flex flex-column flex-auto">
                                <a class="flex flex-column flex-auto tiny font-bold font-underline hide-xs-only ph-2"
                                   :class="'text-' + themeColor"
                                   :data-jump-to-time="timecode">
                                    {{ formattedTimecode }}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-column flex-auto body ph-2 hide-sm-up pointer"
                         @click="openAssignment">
                        <i class="fas"
                           :class="accordionButtonIconClasses"></i>
                    </div>
                </div>
            </div>
            <div class="flex flex-column xs-12 md-4 complete-column">
                <div class="flex flex-row">
                    <button class="btn collapse-100 mr-1"
                            v-if="soundsliceSlug"
                            @click="openExercise">
                        <span class="text-white bg-grey-3 inverted text-grey-3">
                            <i class="fas fa-play mr-1"></i> Practice
                        </span>
                    </button>

                    <button class="btn collapse-100"
                            @click.stop="markAsComplete">
                        <span :class="completeButtonClasses">
                            <i class="fas fa-check mr-1"></i>
                            {{ isComplete ? 'Completed' : 'Complete' }}
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <transition name="slide-down-fade">
            <div v-if="accordionActive && thisAssignment != null"
                 v-show="!this.accordionLoading"
                 class="flex flex-row pa-2">
                <div class="flex flex-column grow">
                    <div class="flex flex-column ph pa-3">

                        <div class="flex flex-row">
                            <div class="body mb-3" v-html="$_description">{{ $_description }}</div>
                        </div>
                        <div class="flex flex-row carousel overflow mv pb-3"
                             ref="carouselContainer"
                             v-if="$_totalPages > 0">

                            <div class="flex flex-column xs-12 grow page"
                                 v-for="(page, i) in $_sheet_music_pages"
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
                                 v-if="currentPage < $_totalPages"
                                 @click="scrollToPage(currentPage + 1)">
                                <i class="fas fa-chevron-right"></i>
                            </div>

                            <div class="page-buttons" v-if="$_totalPages > 1">
                                <div v-for="(page, i) in pages"
                                     class="page-button mh-1 rounded bg-black"
                                     :class="currentPageClass(i + 1)"
                                     @click="scrollToPage(i + 1)"
                                     :key="'pageButton' + (i + 1)"></div>
                            </div>
                        </div>
                        <div class="flex flex-row hide-sm-up" v-if="timecode != 0">
                            <a class="tiny font-bold font-underline"
                               :class="'text-' + themeColor"
                               :data-jump-to-time="timecode">
                                {{ formattedTimecode }}
                            </a>
                        </div>
                    </div>
                </div>
                <div class="flex flex-column pa-2 sm-3 hide-xs-only"></div> <!--Spacer-->
            </div>
        </transition>

        <transition name="show-from-bottom">
            <div id="practiceOverlay" class="bg-white" v-if="open">
                <div class="flex flex-column embed-column">
                    <div class="flex flex-row align-v-center flex-auto bb-grey-4-1 bg-grey-5 ph">
                        <div class="flex flex-column">
                            <h2 class="title text-white text-truncate-2-lines">{{ title }}</h2>
                        </div>

                        <div class="flex flex-column close-exercise uppercase text-white align-v-center pv-1 pointer flex-auto"
                             @click="closeExercise">
                            <div class="flex flex-row tiny align-v-center">
                                Close <i class="fas fa-times ml-1"></i>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-row grow">
                        <iframe id="ssEmbed"
                                :src="'https://www.soundslice.com/scores/' + soundsliceSlug + '/embed/?api=1&scroll_type=2&branding=0&enable_mixer=0'" frameBorder="0" allowfullscreen
                                @load="loading = false"></iframe>
                    </div>
                </div>

                <div class="loading-exercise heading bg-white corners-3 shadow ph-4 pv-2"
                     v-if="loading">
                    <i class="fas fa-spinner fa-spin"
                       :class="'text-' + themeColor"></i>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import moment from 'moment';
    import Requests from '../assets/js/classes/requests';
    import Utils from '../assets/js/classes/utils';
    import Toasts from '../assets/js/classes/toasts';

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
            position: {
                type: String|Number,
                default: () => null
            },
            title: {
                type: String,
                default: () => ''
            },
            id: {
                type: Number|String,
                default: () => 0
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
            timecode: {
                type: Number|String,
                default: () => 0
            },
            xp: {
                type: Number|String,
                default: () => 0
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
                open: false,
                loading: true,
                isPlaying: false,
                accordionActive: false,
                accordionLoading: false,
                thisAssignment: {
                    id: 0,
                    sheet_music_image_url: [],
                    soundslice_slug: '',
                    description: '',
                },
                isComplete: this.completed,
            }
        },
        methods: {
            scrollToPage(page){
                this.currentPage = page;
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

            openAssignment(){

                if(this.thisAssignment.id === 0){
                    this.accordionLoading = true;

                    Requests.getContentById(this.id)
                        .then(response => {
                            if(response){
                                this.thisAssignment = Utils.flattenContent(response.data.data)[0];

                                this.accordionActive = !this.accordionActive;

                                setTimeout(() => {
                                    this.accordionLoading = false;
                                }, 750);
                            }
                        });
                }
                else {
                    this.accordionActive = !this.accordionActive;
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

            markAsComplete(event){
                const element = event.target;
                const vm = this;

                if(this.isComplete){
                    Toasts.confirm({
                        title: 'Hold your horses… This will reset all of your progress, are you sure about this?',
                        submitButton: {
                            text: '<span class="bg-drumeo text-white">Reset</span>',
                            callback: () => {

                                this.isComplete = !this.isComplete;

                                Requests.resetContentProgress(vm.id)
                                    .then(resolved => {
                                        if(resolved){
                                            element.classList.add('remove-request-complete');

                                            Toasts.push({
                                                icon: 'happy',
                                                title: 'READY TO START AGAIN?',
                                                message: 'Your progress has been reset.'
                                            });

                                            this.$emit('assignmentComplete', {
                                                complete: false
                                            });
                                        }
                                    });
                            }
                        },
                        cancelButton: {
                            text: '<span class="bg-grey-3 inverted text-grey-3">Cancel</span>'
                        }
                    });
                }
                else {
                    this.isComplete = !this.isComplete;

                    Requests.markContentAsComplete(vm.id)
                        .then(resolved => {
                            if(resolved){
                                element.classList.add('add-request-complete');

                                this.$emit('assignmentComplete', {
                                    complete: true
                                });
                            }
                        });
                }
            },

            syncCompleteState(complete){
                this.isComplete = complete.detail.complete;
            }
        },
        computed: {
            pageScrollPosition(){
                return "transform:translateX(-" + (100 * (this.currentPage - 1)) + "%)";
            },

            completeButtonClasses(){
                const textColor = 'text-' + this.themeColor;
                const bgColor = 'bg-' + this.themeColor;

                return this.isComplete ?
                    'text-white ' + bgColor :
                    'inverted ' + bgColor + ' ' + textColor;
            },

            accordionButtonClasses(){
                return {
                    'inverted': this.accordionActive,
                    'text-grey-3': this.accordionActive,
                    'text-white': !this.accordionActive
                }
            },

            accordionButtonIconClasses(){
                return {
                    'fa-chevron-up': !this.accordionActive && !this.accordionLoading,
                    'fa-chevron-down': this.accordionActive && !this.accordionLoading,
                    'fa-spinner': this.accordionActive && this.accordionLoading,
                    'fa-spin': this.accordionActive && this.accordionLoading,
                }
            },

            $_totalPages(){
                return this.$_sheet_music_pages ? this.$_sheet_music_pages.length : 0;
            },

            $_sheet_music_pages(){
                if(Array.isArray(this.thisAssignment.sheet_music_image_url)){
                    return this.thisAssignment.sheet_music_image_url;
                }

                return this.thisAssignment.sheet_music_image_url ? [this.thisAssignment.sheet_music_image_url] : [];
            },

            $_soundslice_slug(){
                return this.thisAssignment.soundslice_slug || '';
            },

            $_description(){
                return this.thisAssignment.description || '';
            },

            formattedTimecode(){
                const duration = moment.duration((this.timecode * 1000)).as('milliseconds');

                if(this.timecode < 3600){
                    return moment.utc(duration).format('m:ss');
                }

                return moment.utc(duration).format('h:mm:ss');
            }
        },
        mounted(){
            if(this.position < 3){
                this.openAssignment();
            }

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


            window.addEventListener('lesson-complete', this.syncCompleteState);
        },
        beforeDestroy(){
            window.removeEventListener('lesson-complete', this.syncCompleteState);
        }
    }
</script>
<style lang="scss">
    @import '../assets/sass/partials/_variables.scss';

    .arrow-column {
        display:flex;
        flex:0 0 60px;
        padding-right:10px;
    }

    .complete-column {
        margin-top:$gutterWidth / 2;

        @include medium {
            margin-top:0;
        }
    }

    .assignment-title {
        @include small {
            flex:0 0 auto;
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


    .embed-column {
        height:100%;
    }

    #ssEmbed {
        /*position:absolute;*/
        /*left:0;*/
        /*bottom:0;*/
        width:100%;
        /*height:calc(100% - 50px);*/
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