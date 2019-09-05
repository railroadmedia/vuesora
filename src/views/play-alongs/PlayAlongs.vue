<template>
    <div class="flex flex-column grow">
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
import CatalogueListItem from '../catalogues/_CatalogueListItem.vue';
import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';
import PlayAlongsPlayer from './PlayAlongsPlayer.vue';
import ContentModel from '../../assets/js/models/_model';
import EventHandlers from './event-handlers';

export default {
    name: 'PlayAlongs',
    components: {
        'catalogue-list-item': CatalogueListItem,
        'play-alongs-player': PlayAlongsPlayer,
    },
    mixins: [UserCatalogueEvents, EventHandlers],
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
            default: 10,
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
            page: 1,
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
    },
};
</script>
