<template>
    <div class="flex flex-column bg-white shadow corners-3 content-table">
        <div class="flex flex-row pa">
            <h1 class="heading">All Forums</h1>
        </div>

        <forum-threads-table-item v-for="thread in threadsArray"
                                  :key="thread.id"
                                  :thread="thread"
                                  :brand="brand"></forum-threads-table-item>
    </div>
</template>
<script>
    import ForumThreadsTableItem from './_ForumThreadsTableItem';
    import Toasts from '../../assets/js/classes/toasts.js';
    import axios from 'axios';

    export default {
        name: 'forum-threads-table',
        components: {
            'forum-threads-table-item': ForumThreadsTableItem
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
        data (){
            return {
                threadsArray: this.threads
            }
        },
        methods: {
            getThreads(){
                return axios.get('/members/forum/threads-json')
                    .then(response => {
                        return response.data;
                    })
                    .catch(error => {
                        console.error(error);

                        Toasts.errorWarning('We\'re sorry! An unexpected error occurred. Please refresh the page and try again.');
                    })
            }
        },
        mounted (){
            // setInterval(() => {
            //     this.getThreads().then(resolution => {
            //         this.threadsArray = resolution;
            //     })
            // }, 5000);
        }
    }
</script>
<style>

</style>