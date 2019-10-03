<template>
    <div class="flex flex-column grow play-alongs">
        <play-alongs-filters
            v-if="showFilters"
            :theme-color="themeColor"
            :filter-options="filterOptions"
            :selected-filters="selectedFilters"
            :loading="loading"
            @filterChange="handleFilterChange"
        ></play-alongs-filters>

        <div
            v-if="showFilters"
            class="flex flex-row flex-wrap-xs-only"
        >
            <div class="flex flex-column xs-12 sm-6">
                <div class="flex flex-row flex-wrap-xs-only ph-1">
                    <button
                        class="btn collapse-square mr-1"
                        title="Toggle Favorites"
                        @click="toggleFavorites"
                    >
                        <span
                            class="bg-drumeo"
                            :class="showFavoritesOnly ? 'text-white' : 'inverted text-drumeo'"
                        >
                            <i class="fas fa-star"></i>
                        </span>
                    </button>

                    <button
                        class="btn collapse-square mr-1"
                        title="Toggle Completed"
                        @click="toggleCompleted"
                    >
                        <span
                            class="bg-drumeo"
                            :class="showCompletedOnly ? 'text-white' : 'inverted text-drumeo'"
                        >
                            <i class="fas fa-check"></i>
                        </span>
                    </button>

                    <button
                        class="btn collapse-square mr-1"
                        title="Toggle Shuffle"
                        @click="toggleShuffle"
                    >
                        <span
                            class="bg-drumeo"
                            :class="isShuffle ? 'text-white' : 'inverted text-drumeo'"
                        >
                            <i class="fas fa-random"></i>
                        </span>
                    </button>
                </div>
            </div>

            <div class="flex flex-column xs-12 sm-6 align-h-right align-v-center pa-2">
                <div class="flex flex-row flex-wrap">
                    <div class="flex flex-column form-group mr-1">
                        <select
                            id="sortInput"
                            type="text"
                            class="borderless"
                            style="width:200px;"
                            @change="handleContentSort"
                        >
                            <option
                                value="-published_on"
                                :selected="sort === '-published_on'"
                            >
                                Newest First
                            </option>
                            <option
                                value="published_on"
                                :selected="sort === 'published_on'"
                            >
                                Oldest First
                            </option>
                            <option
                                value="slug"
                                :selected="sort === 'slug'"
                            >
                                Name: A to Z
                            </option>
                            <option
                                value="-slug"
                                :selected="sort === '-slug'"
                            >
                                Name: Z to A
                            </option>
                        </select>

                        <label
                            for="sortInput"
                            :class="brand"
                        >
                            Sort By:
                        </label>
                    </div>

                    <div class="flex flex-column form-group">
                        <select
                            id="limitInput"
                            type="text"
                            class="borderless"
                            style="width:100px;"
                            @change="handleContentLimit"
                        >
                            <option
                                value="10"
                                :selected="Number(limit) === 10"
                            >
                                10
                            </option>
                            <option
                                value="20"
                                :selected="Number(limit) === 20"
                            >
                                20
                            </option>
                            <option
                                value="50"
                                :selected="Number(limit) === 50"
                            >
                                50
                            </option>
                        </select>

                        <label
                            for="limitInput"
                            :class="brand"
                        >
                            Per Page:
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="showPagination"
            class="flex flex-row bg-grey-7 bt-grey-1-1 pagination-row align-h-right"
        >
            <pagination
                :current-page="Number(page)"
                :total-pages="totalPages"
                @pageChange="handlePageChange"
            ></pagination>
        </div>

        <play-alongs-list-item
            v-for="(item, i) in content"
            :ref="`list${item.id}`"
            :key="`list${item.id}`"
            :index="i + 1"
            :item="item"
            :brand="brand"
            :active="activeItem != null ? item.id === activeItem.id : false"
            :display-user-interactions="false"
            :no-link="true"
            :theme-color="themeColor"
            :show-user-actions="showUserActions"
            @addToList="addToListEventHandler"
            @markAsComplete="completedEventHandler"
            @click.native="updateTrack(item)"
        ></play-alongs-list-item>

        <div
            v-if="content.length === 0"
            class="flex flex-row pa-2"
        >
            <div class="flex flex-column">
                <p class="body mb-2">
                    We're sorry, no results were found using those filters.
                    Try removing a filter to broaden your search.
                </p>

                <p class="body">
                    If you're certain you should be seeing content,
                    please contact support by using the chat widget on the bottom right of your screen.
                    Alternatively, you can email <a href="mailto:support@drumeo.com">support@drumeo.com</a>.
                </p>
            </div>
        </div>

        <div
            v-if="showPagination"
            class="flex flex-row bg-grey-7 bt-grey-1-1 pagination-row align-h-right"
        >
            <pagination
                :current-page="Number(page)"
                :total-pages="totalPages"
                @pageChange="handlePageChange"
            ></pagination>
        </div>

        <transition name="show-from-bottom">
            <div
                v-show="loading"
                class="loading bg-white corners shadow pa-2"
                @click.stop.prevent
            >
                <loading-animation :theme-color="themeColor" />
            </div>
        </transition>

        <play-alongs-player
            v-show="activeItem != null"
            ref="progressBar"
            :active-item="activeItem"
            :audio-player="audioPlayer"
            :drums="drums"
            :click="click"
            :loop="loop"
            :current-time="currentTime"
            :total-duration="totalDuration"
            :current-position="currentPosition"
            :is-playing="isPlaying"
            :anchor-offsets="anchorOffsets"
            :current-mouse-x="currentMousePosition.x"
            :played-content="playedContent"
            :total-results="totalResults"
            :is-shuffle="isShuffle"
            :current-volume="Number(currentVolume * 100)"
            @playPause="playPause"
            @nextTrack="playNextTrack"
            @previousTrack="playPreviousTrack"
            @seek="seek"
            @drums="toggleDrums"
            @click="toggleClick"
            @loop="toggleLoop"
            @anchorMouseDown="handleAnchorMouseDown"
            @anchorButtonClick="handleAnchorButtonClick"
            @volumeChange="changeVolume"
        ></play-alongs-player>

        <div class="flex flex-row hide">
            <audio
                ref="audioPlayer"
                preload="auto"
            ></audio>
        </div>
    </div>
</template>
<script>
import * as QueryString from 'query-string';
import Utils from 'js-helper-functions/modules/utils';
import ContentService from '../../assets/js/services/content';
import PlayAlongsListItem from './PlayAlongsListItem.vue';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';
import PlayAlongsPlayer from './PlayAlongsPlayer.vue';
import ContentModel from '../../assets/js/models/_model';
import EventHandlers from './event-handlers';
import ThemeClasses from '../../mixins/ThemeClasses';
import PlayAlongsFilters from './PlayAlongsFilters.vue';
import Pagination from '../../components/Pagination.vue';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation.vue';
import Toasts from '../../assets/js/classes/toasts';

export default {
    name: 'PlayAlongs',
    components: {
        'play-alongs-list-item': PlayAlongsListItem,
        'play-alongs-player': PlayAlongsPlayer,
        'play-alongs-filters': PlayAlongsFilters,
        'loading-animation': LoadingAnimation,
        pagination: Pagination,
    },
    mixins: [ThemeClasses, UserCatalogueEvents, EventHandlers],
    props: {
        brand: {
            type: String,
            default: () => 'drumeo',
        },

        preLoadedContent: {
            type: Object,
            default: () => ({}),
        },

        userPlaylistId: {
            type: [String, Number],
            default: () => null,
        },

        contentEndpoint: {
            type: String,
            default: () => '/railcontent/content',
        },

        showFilters: {
            type: Boolean,
            default: () => true,
        },

        showPagination: {
            type: Boolean,
            default: () => true,
        },

        useUrlParams: {
            type: Boolean,
            default: () => true,
        },

        showUserActions: {
            type: Boolean,
            default: () => true,
        },
    },
    data() {
        return {
            content: this.preLoadedContent.data,
            loading: false,
            currentPlaybackRate: 1,
            currentVolume: 1,
            page: 1,
            limit: 20,
            sort: '-published_on',
            totalResults: this.preLoadedContent.meta.totalResults,
            filterOptions: this.getFilterOptions(this.preLoadedContent.meta.filterOptions),
            isKeyboardControlsEnabled: false,
            selectedFilters: {
                bpm: null,
                style: null,
                difficulty: null,
            },
            shufflePlaylist: [],
            playedContent: [],
            showFavoritesOnly: false,
            showCompletedOnly: false,
            isShuffle: false,
            activeItem: null,
            audioPlayer: this.$refs.audioPlayer,
            drums: false,
            click: true,
            loop: false,
            currentTime: 0,
            totalDuration: 0,
            anchorOffsets: {
                a: 0,
                b: 100,
            },
            anchorMouseDown: {
                a: false,
                b: false,
            },
            currentMousePosition: {
                x: 0,
                y: 0,
            },
        };
    },
    computed: {
        isPlaying: {
            cache: false,
            get() {
                if (this.audioPlayer != null) {
                    return this.audioPlayer.paused === false;
                }

                return false;
            },
        },

        currentPosition() {
            return (this.currentTime / this.totalDuration) * 100;
        },

        filterQueryObject() {
            return {
                required_fields: this.parseRequiredFields(),
                page: this.page,
                limit: this.limit,
                required_parent_ids: this.showFavoritesOnly ? [this.userPlaylistId] : undefined,
                required_user_states: this.showCompletedOnly ? ['completed'] : undefined,
                sort: this.sort,
            };
        },

        filterQueryString() {
            return QueryString.stringify(this.filterQueryObject, { arrayFormat: 'bracket' });
        },

        totalPages() {
            return Math.ceil(this.totalResults / this.limit) || 1;
        },
    },
    mounted() {
        this.audioPlayer = this.$refs.audioPlayer;

        Object.keys(this.eventHandlers).forEach((event) => {
            this.audioPlayer.addEventListener(
                event,
                this.eventHandlers[event],
            );
        });

        if (this.useUrlParams) {
            this.getActiveFilters();
        }

        this.getDefaultVolume();

        this.addMouseEventHandlers();

        this.enableKeyboardControls();
    },
    beforeDestroy() {
        Object.keys(this.eventHandlers).forEach((event) => {
            this.audioPlayer.removeEventListener(
                event,
                this.eventHandlers[event],
            );
        });

        this.removeMouseEventHandlers();
    },
    methods: {
        getContent(resetPlaylist = false) {
            this.loading = true;

            return ContentService.getContent({
                ...this.filterQueryObject,
                brand: this.brand,
                included_types: ['play-along'],
                statuses: ['published'],
                include_future: 0,
            })
                .then((response) => {
                    if (response) {
                        this.content = response.data.data;
                        this.page = response.data.meta.page;
                        this.totalResults = response.data.meta.totalResults;
                        this.filterOptions = this.getFilterOptions(response.data.meta.filterOptions);


                        this.$nextTick(() => {
                            this.loading = false;

                            if (resetPlaylist) {
                                this.generateRandomPlaylist();
                            }
                        });
                    }
                });
        },

        getFilterOptions(options) {
            const parsedOptions = this.parseBpmOptions(options);

            if (Array.isArray(options)) {
                return {
                    bpm: [],
                    style: [],
                    difficulty: [],
                };
            }

            return parsedOptions;
        },

        parseBpmOptions(options) {
            const acceptedBpmOptions = [
                {
                    label: '50-90', min: 50, max: 90, active: false, 
                },
                {
                    label: '91-120', min: 91, max: 120, active: false, 
                },
                {
                    label: '121-150', min: 121, max: 150, active: false, 
                },
                {
                    label: '151-180', min: 151, max: 180, active: false, 
                },
                {
                    label: '181+', min: 181, max: 10000, active: false, 
                },
            ];

            const parsedOptions = {
                difficulty: options.difficulty ? options.difficulty.sort((a, b) => a - b) : [],
                style: options.style,
                bpm: [],
            };

            if (options.bpm) {
                acceptedBpmOptions.forEach((option) => {
                    options.bpm.forEach((bpm) => {
                        if (bpm >= option.min && bpm <= option.max) {
                            // eslint-disable-next-line no-param-reassign
                            option.active = true;
                        }
                    });
                });

                parsedOptions.bpm = acceptedBpmOptions
                    .filter(option => option.active)
                    .map(option => option.label);
            }

            return parsedOptions;
        },

        parseRequiredFields() {
            const selectedFilters = Object.keys(this.selectedFilters)
                .filter(key => this.selectedFilters[key] != null);
            const parsedFields = [];

            selectedFilters.forEach((key) => {
                if (key === 'bpm') {
                    const bpmRange = this.selectedFilters[key].replace(/[+]/, '').split('-');

                    parsedFields.push(`bpm,${bpmRange[0]},integer,>`);
                    if (bpmRange[1]) {
                        parsedFields.push(`bpm,${bpmRange[1]},integer,<`);
                    }
                } else {
                    parsedFields.push(`${key},${this.selectedFilters[key]}`);
                }
            });

            return parsedFields;
        },

        getActiveFilters() {
            const urlParams = QueryString.parse(window.location.search, { arrayFormat: 'bracket' });

            this.page = urlParams.page || 1;
            this.limit = urlParams.limit || 20;
            this.sort = urlParams.sort || '-published_on';

            if (urlParams.required_fields != null && urlParams.required_fields.length > 0) {
                urlParams.required_fields.forEach((field) => {
                    const keyValue = field.split(',');

                    // Since BPM can take either one or two values we just parse that here
                    // If it's only one value then that's a minimum only, so we add a plus sign
                    // Otherwise we remove the plus sign and add a dash between the two values
                    if (keyValue[0] === 'bpm') {
                        if (this.selectedFilters.bpm == null) {
                            this.$set(
                                this.selectedFilters,
                                'bpm',
                                `${keyValue[1]}+`,
                            );
                        } else {
                            this.$set(
                                this.selectedFilters,
                                'bpm',
                                `${this.selectedFilters.bpm.replace('+', '')}-${keyValue[1]}`,
                            );
                        }
                    } else {
                        this.$set(this.selectedFilters, keyValue[0], keyValue[1]);
                    }
                });
            }

            if (urlParams.required_parent_ids != null
                && urlParams.required_parent_ids.indexOf(this.userPlaylistId) !== -1) {
                this.showFavoritesOnly = true;
            }

            if (urlParams.required_user_states != null
                && urlParams.required_user_states.indexOf('completed') !== -1) {
                this.showCompletedOnly = true;
            }
        },

        updateTrack(item) {
            if (this.activeItem != null && item.id === this.activeItem.id) {
                this.playPause();
            } else {
                this.playTrack(item);
            }
        },

        playPause() {
            if (this.isPlaying) {
                this.audioPlayer.pause();
            } else {
                this.audioPlayer.play();
            }

            this.$nextTick(() => this.$forceUpdate());
        },

        playTrack(item) {
            this.activeItem = new ContentModel('play-along', {
                brand: this.brand,
                post: item,
            });

            this.switchTrack(false);

            this.audioPlayer.play();
        },

        switchTrack(resume) {
            const { currentTime } = this;
            const trackUrl = this.activeItem.getPostDatum(
                `mp3_${this.drums ? 'yes' : 'no'}_drums_${this.click ? 'yes' : 'no'}_click_url`,
            );

            if (this.audioPlayer.src !== trackUrl) {
                this.updateSource(trackUrl, resume, currentTime);

                if (!resume) {
                    this.$nextTick(() => {
                        const domElement = this.$refs[`list${this.activeItem.id}`][0].$el;

                        window.scrollTo({
                            top: domElement.offsetTop - 100,
                            left: 0,
                            behavior: 'smooth',
                        });
                    });
                }

                // if (trackUrl === 'TBD') {
                //     Toasts.push({
                //         icon: 'doh',
                //         title: 'TRACK MISSING',
                //         themeColor: this.themeColor,
                //         message: 'We\'re sorry, the track you tried to play couldn\'t be found.',
                //         timeout: 10000,
                //     });
                // }
            }
        },

        updateSource(source, resume, time) {
            this.audioPlayer.src = source;

            const resumeTrack = () => {
                this.seek(time);
                this.audioPlayer.removeEventListener('canplay', resumeTrack);
            };

            if (resume) {
                this.audioPlayer.addEventListener('canplay', resumeTrack);
            }
        },

        async playPreviousTrack() {
            if (this.loading) {
                return false;
            }

            let contentToPlay;
            const currentIndex = this.content.map(item => item.id).indexOf(this.activeItem.id);

            if (this.isShuffle) {
                const { index, page } = this.playedContent[1];

                if (page !== this.page) {
                    await this.handlePageChange({ page });
                }

                contentToPlay = this.content[index];

                this.$nextTick(() => {
                    this.updateTrack(contentToPlay);

                    this.shufflePlaylist.splice(0, 0, this.playedContent[0]);
                    this.playedContent.splice(0, 1);
                });
            } else {
                if (currentIndex === 0) {
                    const pageToGoTo = Number(this.page) === 1 ? this.totalPages : Number(this.page) - 1;

                    if (pageToGoTo !== this.page) {
                        await this.handlePageChange({ page: pageToGoTo });
                    }

                    // eslint-disable-next-line prefer-destructuring
                    contentToPlay = this.content[this.content.length - 1];
                } else {
                    contentToPlay = this.content[currentIndex - 1];
                }

                this.$nextTick(() => {
                    if (this.loop) {
                        this.resetAnchors();
                    }

                    this.updateTrack(contentToPlay);
                });
            }
        },

        async playNextTrack() {
            if (this.loading) {
                return false;
            }

            let contentToPlay;

            if (this.isShuffle) {
                const { page, index } = this.shufflePlaylist[0];

                if (this.totalPages > 1 && page !== this.page) {
                    await this.handlePageChange({ page });
                }

                contentToPlay = this.content[index];

                this.playedContent.splice(0, 0, this.shufflePlaylist[0]);
                this.shufflePlaylist.splice(0, 1);
            } else {
                const currentIndex = this.content.map(content => content.id).indexOf(this.activeItem.id);

                if (currentIndex + 1 === this.content.length) {
                    const pageToGoTo = Number(this.page) === Number(this.totalPages)
                        ? 1
                        : Number(this.page) + 1;

                    if (pageToGoTo !== this.page) {
                        await this.handlePageChange({ page: pageToGoTo });
                    }

                    // eslint-disable-next-line prefer-destructuring
                    contentToPlay = this.content[0];
                } else {
                    contentToPlay = this.content[currentIndex + 1];
                }
            }

            this.$nextTick(() => {
                if (this.loop) {
                    this.resetAnchors();
                }

                this.updateTrack(contentToPlay);
            });
        },

        seek(position) {
            this.audioPlayer.currentTime = position;
        },

        setRate(rate) {
            let _rate = rate;

            if (rate > 2) {
                _rate = 2;
            }

            if (rate < 0.25) {
                _rate = 0.25;
            }

            this.currentPlaybackRate = _rate;
            this.audioPlayer.playbackRate = _rate;
        },

        changeVolume(volume) {
            if (volume > 100 || volume < 0) {
                return false;
            }

            this.audioPlayer.volume = Math.round(volume) / 100;
            this.currentVolume = this.audioPlayer.volume;

            if (volume !== 0) {
                localStorage.setItem('playAlongsVolume', volume);
            }
        },

        toggleDrums() {
            this.drums = !this.drums;

            this.switchTrack(true);
            this.playPause();
        },

        toggleClick() {
            this.click = !this.click;

            this.switchTrack(true);
            this.playPause();
        },

        toggleLoop() {
            this.loop = !this.loop;
            this.audioPlayer.loop = this.loop;

            this.$set(this.anchorOffsets, 'a', 0);
            this.$set(this.anchorOffsets, 'b', 100);
        },

        handleAnchorMouseDown(anchor) {
            this.$set(this.anchorMouseDown, anchor, true);
        },

        handleAnchorButtonClick(anchor) {
            let offset = (this.currentTime / this.totalDuration) * 100;

            if (offset > 100) {
                offset = 100;
            } else if (offset < 0) {
                offset = 0;
            }

            this.$set(this.anchorOffsets, anchor, offset);
        },

        resetAnchors() {
            this.$set(this.anchorOffsets, 'a', 0);
            this.$set(this.anchorOffsets, 'b', 100);
        },

        trackMousePosition(event) {
            const posX = event.clientX != null ? event.clientX : event.touches[0].clientX;
            const posY = event.clientY != null ? event.clientY : event.touches[0].clientY;

            this.$set(this.currentMousePosition, 'x', posX);
            this.$set(this.currentMousePosition, 'y', posY);

            this.handleAnchorDrag();
        },

        handleAnchorDrag() {
            let mousePositionOffset = this.getDurationOffsetPercentageByMousePosition();

            if (this.anchorMouseDown.a) {
                if (mousePositionOffset >= this.anchorOffsets.b - 1) {
                    mousePositionOffset = this.anchorOffsets.b - 1;
                } else if (mousePositionOffset < 0) {
                    mousePositionOffset = 0;
                }

                this.$set(this.anchorOffsets, 'a', mousePositionOffset);
            }

            if (this.anchorMouseDown.b) {
                if (mousePositionOffset <= this.anchorOffsets.a + 1) {
                    mousePositionOffset = this.anchorOffsets.a + 1;
                } else if (mousePositionOffset > 100) {
                    mousePositionOffset = 100;
                }

                this.$set(this.anchorOffsets, 'b', mousePositionOffset);
            }
        },

        getDurationOffsetPercentageByMousePosition() {
            return (this.currentMousePosition.x / this.$refs.progressBar.$el.clientWidth) * 100;
        },

        mouseUpEventHandler() {
            this.$set(this.anchorMouseDown, 'a', false);
            this.$set(this.anchorMouseDown, 'b', false);
        },

        updatePageUrl() {
            const new_url = `${window.location.origin + window.location.pathname}?${this.filterQueryString}`;

            window.history.replaceState(window.history.state, null, new_url);
        },

        handleFilterChange(payload) {
            this.page = 1;
            this.$set(this.selectedFilters, payload.key, payload.value);

            if (this.useUrlParams) {
                this.updatePageUrl();
            }

            this.$nextTick(() => {
                this.playedContent = [];

                return this.getContent(this.isShuffle);
            });
        },

        handlePageChange({ page }) {
            this.page = page;

            if (this.useUrlParams) {
                this.updatePageUrl();
            }

            return this.getContent();
        },

        handleContentSort(event) {
            this.sort = event.target.value;

            if (this.useUrlParams) {
                this.updatePageUrl();
            }

            return this.getContent();
        },

        handleContentLimit(event) {
            this.limit = event.target.value;
            this.page = 1;

            if (this.useUrlParams) {
                this.updatePageUrl();
            }

            this.fixPlaylistIndexes();
            this.fixPlayedContentIndexes();

            return this.getContent();
        },

        generateRandomPlaylist() {
            const indexes = Utils.range(this.totalResults);

            for (let i = indexes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
            }

            this.shufflePlaylist = indexes.map(index => (this.getTrackByIndex(index)));
        },

        fixPlaylistIndexes() {
            this.shufflePlaylist = this.shufflePlaylist.map(item => (this.getTrackByIndex(item.originalIndex)));
        },

        fixPlayedContentIndexes() {
            this.playedContent = this.playedContent.map(item => (this.getTrackByIndex(item.originalIndex)));
        },

        getTrackByIndex(originalIndex) {
            const page = Math.ceil(originalIndex / this.limit) || 1;
            const index = originalIndex - ((page - 1) * this.limit);

            return { page, index, originalIndex };
        },

        toggleFavorites() {
            this.page = 1;
            this.showFavoritesOnly = !this.showFavoritesOnly;

            this.updatePageUrl();

            this.$nextTick(() => {
                this.playedContent = [];

                return this.getContent(true);
            });
        },

        toggleCompleted() {
            this.page = 1;
            this.showCompletedOnly = !this.showCompletedOnly;

            this.updatePageUrl();

            this.$nextTick(() => {
                this.playedContent = [];

                return this.getContent(true);
            });
        },
        
        getDefaultVolume() {
            if (window.localStorage.getItem('playAlongsVolume') != null) {
                this.changeVolume(Number(window.localStorage.getItem('playAlongsVolume')));
            }
        },

        enableKeyboardControls() {
            document.addEventListener('keydown', this.keyboardControlEventHandler);
            this.isKeyboardControlsEnabled = true;

            document.addEventListener('focusin', (event) => {
                const element = event.target;
                const isInputElement = element.matches('input[type="text"]')
                    || element.matches('input[type="password"]')
                    || element.matches('input[type="email"]')
                    || element.matches('textarea');

                if (isInputElement) {
                    document.removeEventListener('keydown', this.keyboardControlEventHandler);
                    this.isKeyboardControlsEnabled = false;
                }
            });

            document.addEventListener('focusout', () => {
                if (!this.isKeyboardControlsEnabled) {
                    document.addEventListener('keydown', this.keyboardControlEventHandler);
                    this.isKeyboardControlsEnabled = true;
                }
            });
        },

        keyboardControlEventHandler(event) {
            if (this.keyboardEventHandlers[event.code] && this.activeItem != null) {
                event.stopPropagation();
                event.preventDefault();

                this.keyboardEventHandlers[event.code]();
            }
        },

        toggleShuffle() {
            this.playedContent = [];
            this.isShuffle = !this.isShuffle;

            if (this.isShuffle) {
                this.generateRandomPlaylist();

                this.playNextTrack();
            } else {
                this.shufflePlaylist = [];
            }
        },
        
        addMouseEventHandlers() {
            document.addEventListener('mousemove', this.trackMousePosition);
            document.addEventListener('touchmove', this.trackMousePosition);
            document.addEventListener('mouseup', this.mouseUpEventHandler);
            document.addEventListener('touchend', this.mouseUpEventHandler);
        },
        
        removeMouseEventHandlers() {
            document.removeEventListener('mousemove', this.trackMousePosition);
            document.removeEventListener('touchmove', this.trackMousePosition);
            document.removeEventListener('mouseup', this.mouseUpEventHandler);
            document.removeEventListener('touchend', this.mouseUpEventHandler);
        },

        completedEventHandler(id) {
            const contentToComplete = this.content.find(item => item.id === id);

            if (contentToComplete.completed === true) {
                ContentService.resetContentProgress(id);
            } else {
                ContentService.markContentAsComplete(id);
            }

            contentToComplete.completed = !contentToComplete.completed;
        },
    },
};
</script>
