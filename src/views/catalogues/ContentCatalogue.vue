<template>
    <div class="flex flex-column">
        <grid-catalogue v-if="grid" :$_content="content"></grid-catalogue>

        <list-catalogue v-if="list" :$_content="content"></list-catalogue>
    </div>
</template>
<script>
    import GridCatalogue from './GridCatalogue.vue';
    import ListCatalogue from './ListCatalogue.vue';
    import axios from 'axios';
    import Utils from '../../assets/js/classes/utils';

    export default {
        name: 'content-catalogue',
        components: {
            'grid-catalogue': GridCatalogue,
            'list-catalogue': ListCatalogue,
        },
        props: {
            $_grid: {
                type: Boolean,
                default: () => true
            },
            $_list: {
                type: Boolean,
                default: () => false
            },
            $_brand: {
                type: String,
                default: () => 'drumeo'
            },
            $_limit: {
                type: Number,
                default: () => 10
            },
            $_statuses: {
                type: Array,
                default: () => ['published']
            },
            $_content_endpoint: {
                type: String,
                default: () => '/content'
            }
        },
        data(){
            return {
                grid: this.$_grid,
                list: this.$_list,
                page: 1,
                content: null
            }
        },
        methods: {
            getContent(){
                axios.get(this.$_content_endpoint, {
                    params: {
                        brand: this.$_brand,
                        page: this.page,
                        limit: this.$_limit,
                        statuses: this.$_statuses
                    }
                })
                    .then(response => {
                        if(response){
                            this.content = Utils.flattenContent(response.data.results);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })
            }
        },
        mounted(){
            this.getContent();
        }
    }
</script>