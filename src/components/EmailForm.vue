<template>
    <div class="flex flex-row">
        <div class="flex flex-row flex-wrap" v-if="lessonPage">
            <div class="flex flex-column avatar-col">
                <div class="square">
                    <img class="rounded" :src="userAvatar">
                </div>
            </div>
            <div class="flex flex-column input-col ph">
                <div class="form-group">
                    <input id="questionInput"
                           type="text"
                           class="borderless text-white"
                           v-model="valueInterface"
                           :class="{ 'has-input': this.value.length }">
                    <label for="questionInput" class="recordeo">Ask a Question...</label>
                </div>
            </div>
            <div class="flex flex-column button-col">
                <button class="btn"
                        @click="submitForm">
                    <span class="text-white"  :class="'bg-' + brand">
                        <i class="fas fa-envelope mr-1"></i> Send Question
                    </span>
                </button>
            </div>
        </div>
        <div class="flex flex-column" v-if="!lessonPage">
            <div class="form-group mb textarea">
                <textarea id="questionBox" v-model="valueInterface" :class="{ 'has-input': this.value.length }"></textarea>
                <label for="questionBox" class="recordeo">Put your suggestion here...</label>
            </div>
            <div class="form-group">
                <button class="btn"
                        @click="submitForm">
                    <span class="text-white" :class="'bg-' + brand">
                        Submit
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    import Toasts from '../assets/js/classes/toasts';
    import axios from 'axios';

    export default {
        name: 'email-form',
        props: {
            brand: {
                type: String,
                default: () => 'recordeo'
            },
            endpoint: {
                type: String,
                default: () => '/'
            },
            lessonPage: {
                type: Boolean,
                default: () => false
            },
            userAvatar: {
                type: String,
                default: () => ''
            }
        },
        data (){
            return {
                value: '',
                loading: false
            }
        },
        computed: {
            valueInterface: {
                get (){
                    return this.value;
                },
                set (val){
                    this.value = val;
                }
            }
        },
        methods: {
            submitForm (){
                if(this.value){
                    this.sendRequest()
                        .then(resolved => {

                            if(resolved){
                                Toasts.success('Success! Your Progress has been reset.');
                            }
                        });
                }
            },

            sendRequest (){
                return axios.post(this.endpoint)
                    .then(response => {
                        this.value = '';
                        return response;
                    })
                    .catch(error => {
                        console.error(error);
                        Toasts.errorWarning('We\'re sorry! An unexpected error occurred. Please refresh the page and try again.');
                    })
            }
        }
    }
</script>
<style lang="scss">
    @import "../assets/sass/partials/_variables";

    .button-col {
        flex:0 0 100%;
        margin-top:$gutterWidth / 2;

        @include small {
            flex:0 0 175px;
            margin-top:0;
        }
    }
    .avatar-col {
        flex:0 0 50px;
    }
</style>