<template>
    <div class="">

        <!-- Forums Tabs -->
        <div class="flex flex-row flex-wrap ph pt-3 align-v-center">
            <div class="flex flex-column mb-3 align-v-center">
                <div class="flex flex-row">
                    <a
                        href="/members/forums"
                        class="no-decoration mr-3"
                        :class="!isFollowedSection ? 'tw-text-black' : 'text-grey-2'"
                    >
                        <h1 class="heading pointer">
                            All Forums
                        </h1>
                    </a>
                    <a
                        href="/members/forums?followed=true"
                        class="no-decoration"
                        :class="[isFollowedSection ? 'tw-text-black' : 'text-grey-2', {'hide': searching}]"
                    >
                        <h1 class="heading pointer">
                            Followed
                        </h1>
                    </a>
                </div>
            </div>
        </div>

        <!-- Search Bar -->
        <div class="flex flex-row flex-wrap ph-1 align-v-center">
            <div class="flex flex-column mb-2 search-box">
                <div class="flex flex-row">
                    <div class="flex flex-column form-group pr-1">
                        <input
                            id="threadSearch"
                            ref="searchInput"
                            v-model.lazy="searchInterface"
                            type="text"
                        >
                        <label
                            for="threadSearch"
                            :class="themeColor"
                        >Search</label>

                        <span
                            v-if="searching"
                            id="clearSearch"
                            class="body pointer"
                            @click="clearSearch"
                        >
                            <i class="fas fa-times"></i>
                        </span>
                    </div>
                    <div class="flex flex-column search-icon-col">
                        <button
                            class="btn collapse-square"
                            @click="$refs.searchInput.blur()"
                        >
                            <span class="bg-white text-black flat">
                                <i class="fas fa-search"></i>
                            </span>
                        </button>
                    </div>
                </div>

                <p
                    v-if="searching"
                    class="tiny font-italic text-grey-4"
                >
                    Showing results for <span class="font-bold text-black">"{{ searchInterface }}"</span> in All Forums.
                </p>
            </div>

            <div
                v-if="!searching && brand !== 'pianote'"
                class="flex flex-column mb-3 form-group topic-col"
            >
                <div
                    class="form-group xs-12"
                    style="width:100%;"
                >
                    <select
                        id="commentSort"
                        v-model="filterInterface"
                        class="has-input"
                    >
                        <option
                            v-for="option in filterOptions"
                            :key="option.label"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </select>
                    <label
                        for="commentSort"
                        :class="themeColor"
                    >Select a Topic</label>
                </div>
            </div>
        </div>  
    
    </div>
</template>
<script>
    export default {
        name: 'ForumSearch',
        props: {
            isFollowedSection: {
                type: Boolean,
                default: () => false,
            },
            searching: {
                type: Boolean,
                default: () => false,
            },
        }
    }
</script>
<style lang="scss">
    @import '../../assets/sass/partials/_variables.scss';

    .search-box {
        @include xSmallOnly {
            margin-bottom: $gutterWidth / 2;
        }
    }

    #clearSearch {
        position:absolute;
        top:50%;
        right:0;
        transform:translateY(-50%);
        height:50px;
        width:50px;
        @include flexCenter();
    }

    .search-icon {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }

    .search-icon-col {
        flex:0 0 50px;
    }
</style>