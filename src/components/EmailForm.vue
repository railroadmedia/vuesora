<template>
    <div class="flex flex-column">
        <div class="form-group mb textarea">
            <textarea id="questionBox" v-model="valueInterface" :class="{ 'has-input': this.value.length }"></textarea>
            <label for="questionBox" class="recordeo">Put your suggestion here...</label>
        </div>
        <div class="form-group">
            <button class="btn"
                    @click="submitForm">
                <span class="bg-recordeo text-white">
                    Submit
                </span>
            </button>
        </div>

        <transition name="slide-fade">
            <toast-notification
                    v-if="notify"
                    :active="notify"
                    :success="success"></toast-notification>
        </transition>
    </div>
</template>
<script>
    import ToastNotification from './ToastNotification.vue';
    import axios from 'axios';
    require('es6-promise').polyfill();

    export default {
        name: 'email-form',
        components: {
            'toast-notification': ToastNotification
        },
        props: {
            endpoint: {
                type: String,
                default: () => '/'
            }
        },
        data (){
            return {
                value: '',
                loading: false,
                notify: false,
                success: true,
                notification: '',
                notifyTimeout: null
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
                        .then(resolve => {
                            this.notifyUser();
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
                        this.success = false;
                        this.notifyUser();
                    })
            },

            notifyUser (){
                this.notify = true;

                clearTimeout(this.notifyTimeout);

                this.notifyTimeout = setTimeout(() => {
                    this.notify = false;
                }, 10000);
            }
        }
    }
</script>
<style>

</style>