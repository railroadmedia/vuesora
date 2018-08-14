<template>
    <div class="flex flex-row">
        <div class="flex flex-row" v-if="lessonPage">
            <div class="flex flex-column avatar-col hide-xs-only">
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
                    <label for="questionInput" :class="themeColor">{{ inputLabel }}</label>
                </div>
            </div>
            <div class="flex flex-column send-button-col">
                <a class="btn text-white"
                   :class="'bg-' + themeColor"
                   @click="submitForm">
                    <i class="fas fa-envelope"></i>
                    <span class="hide-xs-only ml-1">Send Question</span>
                </a>
            </div>
        </div>
        <div class="flex flex-column" v-if="!lessonPage">
            <div class="form-group mb textarea">
                <textarea id="questionBox" v-model="valueInterface" :class="{ 'has-input': this.value.length }"></textarea>
                <label for="questionBox" class="recordeo">{{ inputLabel }}</label>
            </div>
            <div class="form-group">
                <button class="btn"
                        @click="submitForm">
                    <span class="text-white" :class="'bg-' + themeColor">
                        Submit
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    import Requests from '../assets/js/classes/requests';
    import Toasts from '../assets/js/classes/toasts';

    export default {
        name: 'email-form',
        props: {
            brand: {
                type: String,
                default: () => 'recordeo'
            },
            themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            subject: {
                type: String,
                default: () => 'Email from ' + this.brand
            },
            emailType: {
                type: String,
                default: () => 'general'
            },
            lessonPage: {
                type: Boolean,
                default: () => false
            },
            userAvatar: {
                type: String,
                default: () => ''
            },
            inputLabel: {
                type: String,
                default: () => 'Ask a Question...'
            },
            successMessage: {
                type: String,
                default: () => 'Your email has been sent! Thank you for your input.'
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
                    Requests.sendEmail(
                        this.value,
                        this.emailType,
                        this.subject
                    )
                        .then(resolved => {
                            if(resolved){
                                Toasts.success(this.successMessage);

                                this.valueInterface = '';
                            }
                        })
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

    #questionInput.text-white {
        color:#fff;
    }
    .send-button-col {
        flex:0 0 50px;

        @include small {
            flex:0 0 175px;
        }
    }
    .avatar-col {
        flex:0 0 50px;
    }
</style>