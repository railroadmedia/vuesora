<template>
    <div class="flex flex-column grow">
        <catalogue-list-item
                v-for="(item, i) in content"
                :key="'list' + item.id"
                :$_index="i + 1"
                :$_item="item"
                :$_brand="$_brand"
                :$_active="item.id === active_id"
                :$_displayUserInteractions="false"
                :$_noLink="true"
                @addToList="addToListEventHandler"
                @click.native="playSong(item.id)"></catalogue-list-item>

        <play-alongs-player v-if="active_id"
                            :$_active_item="$_active_item"></play-alongs-player>
    </div>
</template>
<script>
    import CatalogueListItem from '../catalogues/_CatalogueListItem';
    import Utils from '../../assets/js/classes/utils';
    import UserCatalogueEvents from '../../mixins/UserCatalogueEvents';
    import PlayAlongsPlayer from './PlayAlongsPlayer';

    export default {
        mixins: [UserCatalogueEvents],
        name: 'play-alongs',
        components: {
            'catalogue-list-item': CatalogueListItem,
            'play-alongs-player': PlayAlongsPlayer
        },
        data(){
            return {
                content: this.$_preLoadedContent ? Utils.flattenContent(this.$_preLoadedContent.data) : [],
                loading: false,
                page: 1,
                active_id: null
            }
        },
        props: {
            $_brand: {
                type: String,
                default: () => 'drumeo'
            },

            $_preLoadedContent: {
                type: Object
            },

            $_limit: {
                type: Number,
                default: 10
            },

            $_contentEndpoint: {
                type: String,
                default: () => '/railcontent/content'
            },
        },
        computed: {

            $_active_item(){
                return this.content.filter(item =>
                    item.id === this.active_id
                )[0];
            },
        },
        methods: {

            playSong(id){
                this.active_id = id;

                this.$emit('songUpdate');
            },

            getContent(replace = true){
                if(!this.loading){
                    this.loading = true;

                    axios.get(this.$_contentEndpoint, {
                        params: {
                            page: this.page,
                            brand: this.$_brand,
                            limit: this.$_limit,
                            'included_types[]': ['play-along']
                        }
                    })
                        .then(response => {
                            if(response){
                                // If infinite scroll is enabled:
                                // Just add it to the array, don't replace it
                                if(!replace){
                                    this.content = [
                                        ...this.content,
                                        ...Utils.flattenContent(response.data.data)
                                    ]
                                }
                                else {
                                    this.content = Utils.flattenContent(response.data.data);
                                }

                                this.page = Number(response.data.meta.page);
                            }

                            this.loading = false;
                        })
                        .catch(error => {
                            console.error(error);

                            this.loading = false;
                        })
                }
            },
        },
        mounted(){
            if(!this.$_preLoadedContent && !this.$_preLoadedContent.results.length){
                this.getContent();
            }
        }
    }
</script>