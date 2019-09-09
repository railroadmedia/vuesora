<template>
    <div class="flex flex-column grow">
        <play-alongs-filters
            :filter-options="filterOptions"
            :selected-filters="selectedFilters"
            :loading="loading"
            @filterChange="handleFilterChange"
        ></play-alongs-filters>

        <div class="flex flex-row flex-wrap-xs-only">
            <div class="flex flex-column flex-auto">
                <div class="flex flex-row form-group align-v-center pa-2">
                    <span class="toggle-input mr-1">
                        <input
                            id="favoritesOnly"
                            name="favoritesOnly"
                            :v-model="showFavoritesOnly"
                            :checked="showFavoritesOnly"
                            @change="showFavoritesOnly = !showFavoritesOnly"
                            type="checkbox"
                        >
                        <span class="toggle">
                            <span class="handle"></span>
                        </span>
                    </span>

                    <label
                        for="favoritesOnly"
                        class="toggle-label"
                    >
                        Show favorites only
                    </label>
                </div>
            </div>

            <div class="flex flex-column flex-auto">
                <div class="flex flex-row form-group align-v-center pa-2">
                    <span class="toggle-input mr-1">
                        <input
                            id="isShuffle"
                            name="isShuffle"
                            :v-model="isShuffle"
                            :checked="isShuffle"
                            @change="isShuffle = !isShuffle"
                            type="checkbox"
                        >
                        <span class="toggle">
                            <span class="handle"></span>
                        </span>
                    </span>

                    <label
                        for="favoritesOnly"
                        class="toggle-label"
                    >
                        Shuffle
                    </label>
                </div>
            </div>
        </div>

        <div class="flex flex-row bg-grey-7 bt-grey-1-1 pagination-row align-h-right">
            <pagination
                :current-page="Number(page)"
                :total-pages="totalPages"
                @pageChange="handlePageChange"
            ></pagination>
        </div>

        <catalogue-list-item
            v-for="(item, i) in content"
            :ref="`list${item.id}`"
            :key="`list${item.id}`"
            :index="i + 1"
            :item="item"
            :brand="brand"
            :active="activeItem != null ? item.id === activeItem.id : false"
            :display-user-interactions="false"
            :no-link="true"
            @addToList="addToListEventHandler"
            @click.native="updateTrack(item)"
        ></catalogue-list-item>

        <div class="flex flex-row bg-grey-7 bt-grey-1-1 pagination-row align-h-right">
            <pagination
                :current-page="Number(page)"
                :total-pages="totalPages"
                @pageChange="handlePageChange"
            ></pagination>
        </div>

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
            @playPause="playPause"
            @nextTrack="playNextTrack"
            @previousTrack="playPreviousTrack"
            @seek="seek"
            @drums="toggleDrums"
            @click="toggleClick"
            @loop="toggleLoop"
            @anchorMouseDown="handleAnchorMouseDown"
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
import ContentService from '../../assets/js/services/content';
import CatalogueListItem from '../catalogues/_CatalogueListItem.vue';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';
import PlayAlongsPlayer from './PlayAlongsPlayer.vue';
import ContentModel from '../../assets/js/models/_model';
import EventHandlers from './event-handlers';
import ThemeClasses from '../../mixins/ThemeClasses';
import PlayAlongsFilters from './PlayAlongsFilters.vue';
import Pagination from '../../components/Pagination.vue';
import Prefetch from './prefetch';

export default {
    name: 'PlayAlongs',
    components: {
        'catalogue-list-item': CatalogueListItem,
        'play-alongs-player': PlayAlongsPlayer,
        'play-alongs-filters': PlayAlongsFilters,
        pagination: Pagination,
    },
    mixins: [ThemeClasses, UserCatalogueEvents, EventHandlers, Prefetch],
    props: {
        brand: {
            type: String,
            default: () => 'drumeo',
        },

        preLoadedContent: {
            type: Object,
            default: () => ({}),
        },

        limit: {
            type: Number,
            default: 20,
        },

        contentEndpoint: {
            type: String,
            default: () => '/railcontent/content',
        },
    },
    data() {
        return {
            content: this.preLoadedContent.data,
            loading: false,
            page: this.preLoadedContent.meta.page,
            totalResults: this.preLoadedContent.meta.totalResults,
            filterOptions: this.preLoadedContent.meta.filterOptions,
            selectedFilters: {
                bpm: null,
                style: null,
                difficulty: null,
            },
            playedContent: [],
            showFavoritesOnly: false,
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
                included_fields: Object.keys(this.selectedFilters)
                    .filter(key => this.selectedFilters[key] != null)
                    .map(key => `${key},${this.selectedFilters[key]}`),
                page: this.page,
                limit: this.limit,
            };
        },

        filterQueryString() {
            return QueryString.stringify(this.filterQueryObject, { arrayFormat: 'bracket' });
        },

        totalPages() {
            return Math.ceil(this.totalResults / this.limit);
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

        document.addEventListener('mousemove', this.trackMousePosition);
        document.addEventListener('mouseup', this.mouseUpEventHandler);
    },
    beforeDestroy() {
        Object.keys(this.eventHandlers).forEach((event) => {
            this.audioPlayer.removeEventListener(
                event,
                this.eventHandlers[event],
            );
        });

        document.removeEventListener('mousemove', this.trackMousePosition);
        document.removeEventListener('mouseup', this.mouseUpEventHandler);
    },
    methods: {
        getContent() {
            this.loading = true;

            return ContentService.getContent({
                ...this.filterQueryObject,
                brand: this.brand,
                included_types: ['play-along'],
                statuses: ['published'],
            })
                .then((response) => {
                    if (response) {
                        this.content = response.data.data;
                        this.page = response.data.meta.page;
                        this.totalResults = response.data.meta.totalResults;
                    }

                    this.loading = false;

                    this.preFetchedContent = null;
                });
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

            if (trackUrl !== 'TBD' && this.audioPlayer.src !== trackUrl) {
                this.audioPlayer.src = trackUrl;

                if (resume) {
                    this.seek(currentTime);
                }
            }

            this.$nextTick(() => {
                const domElement = this.$refs[`list${this.activeItem.id}`][0].$el;

                window.scrollTo({
                    top: domElement.offsetTop - 100,
                    left: 0,
                    behavior: 'smooth',
                });
            });
        },

        async playPreviousTrack() {
            if (this.loading) {
                return false;
            }

            const { id, page } = this.playedContent[this.playedContent.length - 2];

            if (page !== this.page) {
                await this.handlePageChange({ page });

                this.updateTrack(
                    this.content.find(item => item.id === id),
                );

                this.playedContent.splice(this.playedContent.length - 1, 1);
            } else {
                this.updateTrack(
                    this.content.find(item => item.id === id),
                );

                this.playedContent.splice(this.playedContent.length - 1, 1);
            }
        },

        async playNextTrack() {
            if (this.loading) {
                return false;
            }

            let contentToPlay;
            const playedContentIds = this.playedContent.map(content => content.id);

            if (this.isShuffle) {
                this.appendPreFetchedContent();

                contentToPlay = this.getRandomContent();

                while (playedContentIds.indexOf(contentToPlay.id) !== -1) {
                    contentToPlay = this.getRandomContent();
                }
            } else {
                const currentIndex = this.content.map(content => content.id).indexOf(this.activeItem.id);

                if (currentIndex + 1 === this.content.length) {
                    await this.handlePageChange({ page: Number(this.page) + 1 });

                    contentToPlay = this.content[0];
                } else {
                    contentToPlay = this.content[currentIndex + 1];
                }
            }

            this.updateTrack(contentToPlay);
        },

        seek(position) {
            this.audioPlayer.currentTime = position;
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

            this.$set(this.anchorOffsets, 'a', 0);
            this.$set(this.anchorOffsets, 'b', 100);
        },

        handleAnchorMouseDown(anchor) {
            this.$set(this.anchorMouseDown, anchor, true);
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
                }

                this.$set(this.anchorOffsets, 'a', mousePositionOffset);
            }

            if (this.anchorMouseDown.b) {
                if (mousePositionOffset <= this.anchorOffsets.a + 1) {
                    mousePositionOffset = this.anchorOffsets.a + 1;
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

            this.updatePageUrl();

            this.playedContent = [];

            return this.getContent();
        },

        handlePageChange({ page }) {
            this.page = page;

            this.updatePageUrl();
            return this.getContent();
        },

        getRandomPageNumber() {
            return Math.floor((Math.random() * this.totalPages) + 1);
        },

        getRandomContent() {
            const index = Math.floor((Math.random() * this.content.length) + 1);

            return this.content[index];
        },
    },
};
</script>
