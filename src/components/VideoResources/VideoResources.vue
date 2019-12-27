<template>
    <div class="flex flex-row flex-wrap align-v-center pv-2">
        <div class="flex flex-column xs-12 sm-5 text-white">
            <h1 class="heading">
                {{ title }}
            </h1>
            <h4
                class="subtitle uppercase text-white"
                v-html="subtitle"
            >
            </h4>
        </div>

        <div class="flex flex-column pv-2 xs-12 sm-7">
            <div class="flex flex-row nmh-1 flex-wrap resource-buttons">
                <div class="flex flex-column resource-button ph-1">
                    <button
                        class="btn stacked"
                        @click="likeContent"
                    >
                        <span
                            style="padding:0 8px;"
                            :class="hasLiked ? themeTextClass : 'text-grey-3'"
                        >
                            <i
                                class="fa-thumbs-up mb-1"
                                :class="hasLiked ? 'fas' : 'fal'"
                            ></i>
                            {{ totalLikes }}
                        </span>
                    </button>
                </div>

                <div class="flex flex-column resource-button ph-1">
                    <button class="btn stacked" data-open-modal="shareVideoModal">
                        <span
                            class="text-grey-3"
                            style="padding:0 8px;"
                        >
                            <i class="fas fa-share mb-1"></i>
                            Share
                        </span>
                    </button>
                </div>

                <div
                    v-if="resources.length > 0"
                    class="flex flex-column resource-button ph-1 relative"
                >
                    <button
                        class="btn open-resources stacked"
                        @click="resourceDropdown = !resourceDropdown"
                    >
                        <span
                            :class="resourceDropdown ? themeTextClass : 'text-grey-3'"
                            style="padding:0 8px;"
                        >
                            <i class="fas fa-download mb-1"></i>
                            Download
                        </span>
                    </button>

                    <transition name="grow-fade">
                        <div
                            v-show="resourceDropdown"
                            class="download-dropdown"
                        >
                            <div class="flex flex-column bg-white corners-3 shadow">
                                <a
                                    v-for="resource in resources"
                                    :key="resource.resource_name"
                                    :href="resource.resource_url"
                                    :aria-label="`Download ${resource.resource_name}`"
                                    class="flex flex-row pa-1 tiny no-decoration text-black
                                           hover-bg-grey-1 align-v-center nowrap"
                                    target="_blank"
                                    download
                                >
                                    <i
                                        class="fas mr-1"
                                        style="font-size:16px;"
                                        :class="getResourceIcon(resource.resource_url)"
                                    ></i>
                                    {{ resource.resource_name }}
                                </a>
                            </div>
                        </div>
                    </transition>
                </div>

                <div class="flex flex-column resource-button ph-1">
                    <button
                        class="btn stacked"
                        @click="addToList"
                    >
                        <span
                            style="padding:0 8px;"
                            :class="hasAdded ? themeTextClass : 'text-grey-3'"
                        >
                            <i
                                class="fas mb-1"
                                :class="hasAdded ? 'fa-times' : 'fa-plus'"
                            ></i>
                            <span class="hide-xs-only">
                                {{ hasAdded ? 'Added' : 'Add to List' }}
                            </span>
                            <span class="hide-sm-up">
                                {{ hasAdded ? 'Added' : 'Add' }}
                            </span>
                        </span>
                    </button>
                </div>
            </div>
        </div>



        <div
            id="shareVideoModal"
            class="modal"
        >
            <div class="flex flex-column bg-white corners-3 shadow pa-3">
                <h1 class="heading mb-2">
                    Share Video Link
                </h1>


                <div class="form-group mb-2">
                    <input
                        id="shareableUrlInput"
                        class="no-label"
                        type="text"
                        :value="shareUrl"
                    >

                    <button
                        id="copyUrlButton"
                        class="btn"
                        @click="copyTimecodeToClipboard"
                    >
                        <span class="text-white bg-grey-3">
                            Copy
                        </span>
                    </button>
                </div>

                <div class="form-group mb-2">
                    <div class="flex flex-row form-group align-v-center">
                        <span class="toggle-input mr-1">
                            <input
                                id="includeTimecode"
                                v-model="useTimecode"
                                type="checkbox"
                                readonly
                            >

                            <span class="toggle">
                                <span class="handle"></span>
                            </span>
                        </span>

                        <label
                            for="includeTimecode"
                            class="toggle-label pointer dense uppercase font-bold tiny"
                        >
                            Start at Current Time
                        </label>
                    </div>
                </div>

                <p class="tiny font-italic text-grey-3">
                    This link is only accessible by {{ toCapitalCase(brand) }} Members.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import Utils from '@musora/helper-functions/modules/utils';
import ThemeClasses from '../../mixins/ThemeClasses';
import ContentService from '../../assets/js/services/content';

export default {
    name: 'VideoResources',
    mixins: [ThemeClasses],
    props: {
        brand: {
            type: String,
            default: () => 'drumeo',
        },

        title: {
            type: String,
            default: () => '',
        },

        parentTitle: {
            type: String,
            default: () => null,
        },

        instructors: {
            type: Array,
            default: () => [],
        },

        isLiked: {
            type: Boolean,
            default: () => false,
        },

        isAdded: {
            type: Boolean,
            default: () => false,
        },

        likeCount: {
            type: Number,
            default: () => 0,
        },

        userId: {
            type: [String, Number],
            default: () => null,
        },

        contentId: {
            type: [String, Number],
            default: () => null,
        },

        resources: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            resourceDropdown: false,
            hasLiked: this.isLiked,
            totalLikes: this.likeCount,
            hasAdded: this.isAdded,
            useTimecode: true,
        };
    },

    computed: {
        subtitle() {
            if (this.parentTitle) {
                return `From <span class="text-${this.themeColor}">${this.parentTitle}</span>`;
            }

            return `With <span class="text-${this.themeColor}">${this.instructors.join(', ')}</span>`;
        },

        currentTime() {
            const { mediaElementVueInstance } = this.$root.$refs;

            if (mediaElementVueInstance) {
                return mediaElementVueInstance.currentTime;
            }

            return 0;
        },

        shareUrl() {
            if (this.useTimecode) {
                return `${location.protocol}//${location.host}${location.pathname}?time=${Math.floor(this.currentTime)}`;
            }

            return `${location.protocol}//${location.host}${location.pathname}`;
        },
    },
    mounted() {
        document.addEventListener('click', (event) => {
            if (!event.target.matches('.open-resources')) {
                this.resourceDropdown = false;
            }
        });
    },
    methods: {
        likeContent() {
            this.hasLiked = !this.hasLiked;

            if (this.hasLiked) {
                this.totalLikes += 1;
            } else {
                this.totalLikes -= 1;
            }

            ContentService.likeContentById({
                is_liked: this.hasLiked,
                content_id: this.contentId,
                user_id: this.userId,
            });
        },

        toCapitalCase: string => Utils.toCapitalCase(string),

        addToList() {
            this.hasAdded = !this.hasAdded;

            this.$nextTick(() => { ContentService.addOrRemoveContentFromList(this.contentId, !this.hasAdded); });
        },

        getResourceIcon(resource) {
            const urlParts = resource.split('.');
            const fileExtension = urlParts[urlParts.length - 1];
            const iconMap = {
                pdf: 'fa-file-pdf',
                mp3: 'fa-file-music',
                zip: 'fa-file-archive',
            };

            return iconMap[fileExtension] || 'fa-file-download';
        },

        copyTimecodeToClipboard() {
            const timecode = document.getElementById('shareableUrlInput');

            if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
                const editable = timecode.contentEditable;
                const { readOnly } = timecode;
                const range = document.createRange();
                const selection = window.getSelection();

                timecode.contentEditable = true;
                timecode.readOnly = false;
                range.selectNodeContents(timecode);
                selection.removeAllRanges();
                selection.addRange(range);
                timecode.setSelectionRange(0, 999999);
                timecode.contentEditable = editable;
                timecode.readOnly = readOnly;
            } else {
                timecode.select();
            }
            document.execCommand('copy');
            timecode.blur();
            window.closeAllModals();

            Toasts.push({
                icon: 'happy',
                title: 'SHARE THE LOVE!',
                message: 'This URL has been copied, and is ready to share!',
            });
        },
    },
};
</script>
