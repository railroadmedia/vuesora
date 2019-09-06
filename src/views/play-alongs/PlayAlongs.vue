<template>
    <div class="flex flex-column grow">
        <play-alongs-filters
            :filter-options="filterOptions"
            :selected-filters="selectedFilters"
            :loading="loading"
            @filterChange="handleFilterChange"
        ></play-alongs-filters>

        <div class="flex flex-row bg-grey-7 bt-grey-1-1 pagination-row align-h-right">
            <pagination
                :current-page="Number(page)"
                :total-pages="totalPages"
                @pageChange="handlePageChange"
            ></pagination>
        </div>

        <catalogue-list-item
            v-for="(item, i) in content"
            :key="'list' + item.id"
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
            @playPause="playPause"
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
import ContentService from '../../assets/js/services/content';
import * as QueryString from 'query-string';
import CatalogueListItem from '../catalogues/_CatalogueListItem.vue';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';
import PlayAlongsPlayer from './PlayAlongsPlayer.vue';
import ContentModel from '../../assets/js/models/_model';
import EventHandlers from './event-handlers';
import ThemeClasses from '../../mixins/ThemeClasses';
import PlayAlongsFilters from './PlayAlongsFilters.vue';
import Pagination from '../../components/Pagination';

export default {
    name: 'PlayAlongs',
    components: {
        'catalogue-list-item': CatalogueListItem,
        'play-alongs-player': PlayAlongsPlayer,
        'play-alongs-filters': PlayAlongsFilters,
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
            active_id: null,
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

            ContentService.getContent({
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

            this.audioPlayer.src = this.activeItem.getPostDatum(
                `mp3_${this.drums ? 'yes' : 'no'}_drums_${this.click ? 'yes' : 'no'}_click_url`,
            );

            if (resume) {
                this.seek(currentTime);
            }
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
            this.getContent();
        },

        handlePageChange({ page }) {
            this.page = page;

            this.updatePageUrl();
            this.getContent();
        },
    },
};
</script>
