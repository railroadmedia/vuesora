<template>
    <div class="flex flex-column bg-white shadow corners-3 content-table">
        <div class="flex flex-row pa-3 align-v-center">
            <div class="flex flex-column align-v-center">
                <div class="flex flex-row">
                    <a href="/members/forums"
                       class="no-decoration text-black mr-3"
                       :class="{ 'bb-recordeo-2': !isFollowedSection }">
                        <h1 class="heading pointer">
                            All Forums
                        </h1>
                    </a>
                    <a href="/members/forums?followed=true"
                       class="no-decoration text-black"
                       :class="{ 'bb-recordeo-2': isFollowedSection }">
                        <h1 class="heading pointer">
                            Followed
                        </h1>
                    </a>

                    <!--<h1 class="heading mr-3 pointer"-->
                    <!--:class="!followed ? 'text-black bb-' + brand + '-2' : 'text-dark'"-->
                    <!--@click="followed = false">-->
                    <!--All Forums-->
                    <!--</h1>-->
                    <!--<h1 class="heading mr-3 pointer"-->
                    <!--:class="followed ? 'text-black bb-' + brand + '-2' : 'text-dark'"-->
                    <!--@click="followed = true">-->
                    <!--Followed-->
                    <!--</h1>-->
                </div>
            </div>
        </div>

            <!--<div class="flex flex-column search-box">-->
                <!--<div class="form-group">-->
                    <!--<input id="threadSearch"-->
                           <!--type="text"-->
                           <!--v-model="searchInterface">-->
                    <!--<label for="threadSearch" class="recordeo">Search</label>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="flex flex-column form-group topic-col">-->
                <!--<clearable-filter labelText="Select a Filter"-->
                                  <!--:filterOptions="['General', 'Courses', 'Tips', 'Website']"-->
                                  <!--@change="handleFilterChange"></clearable-filter>-->
            <!--</div>-->
        <!--</div>-->

        <forum-threads-table-item v-for="thread in threadsArray"
                                  :key="thread.id"
                                  :thread="thread"
                                  :brand="brand"></forum-threads-table-item>

        <!--<div class="flex flex-row bg-light pagination-row align-h-right">-->
            <!--<pagination :currentPage="currentPage"-->
                        <!--:totalPages="10"-->
                        <!--@pageChange="handlePageChange"></pagination>-->
        <!--</div>-->
    </div>
</template>
<script>
    import ForumThreadsTableItem from './_ForumThreadsTableItem';
    import Pagination from '../../components/Pagination.vue';
    import ClearableFilter from '../../components/ClearableFilter.vue';
    import Requests from '../../assets/js/classes/requests';

    export default {
        name: 'forum-threads-table',
        components: {
            'forum-threads-table-item': ForumThreadsTableItem,
            'pagination': Pagination,
            'clearable-filter': ClearableFilter
        },
        props: {
            threads: {
                type: Array,
                default: () => []
            },
            brand: {
                type: String,
                default: () => 'recordeo'
            }
        },
        data() {
            return {
                threadsArray: this.threads,
                currentPage: 1,
                searchTerm: '',
                filter: 'all',
                timeout: null,
                followed: false
            }
        },
        computed: {
            searchInterface: {
                get() {
                    return this.searchTerm;
                },
                set(val) {
                    clearTimeout(this.timeout);

                    this.timeout = setTimeout(() => {
                        this.searchTerm = val;

                        this.getThreads();
                    }, 800);
                }
            },
            isFollowedSection() {
                return String(location.search).includes('followed=true');
            }
        },
        methods: {
            getThreads() {
                return Requests.getForumThreads()
                    .then(data => {
                        this.threadsArray = data;
                    });
            },

            handlePageChange(payload) {
                this.currentPage = payload.page;

                this.getThreads();
            },

            handleFilterChange(payload) {
                this.filter = payload.value;

                this.getThreads();
            }
        },
        watch: {
            followed() {
                this.getThreads();
            }
        },
        mounted() {

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

    .search-icon {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }
</style>