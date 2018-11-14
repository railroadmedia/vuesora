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
        <div class="flex flex-column relative" v-if="!lessonPage">
            <div v-if="loading"
                 class="loading-element"
                 :class="'text-' + themeColor">
                <i class="fas fa-spinner fa-spin"></i>
                <p class="x-tiny font-italic">Loading Please Wait...</p>
            </div>
            <div class="form-group mb textarea">
                <textarea id="questionBox" v-model="valueInterface" :class="{ 'has-input': this.value.length }"></textarea>
                <label for="questionBox" :class="themeColor">{{ inputLabel }}</label>
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
            emailSubject: {
                type: String,
                default: () => ''
            },
            recipient:{
                type: String,
                default: () => null
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
                    this.loading = true;

                    Requests.sendEmail(
                        this.value,
                        this.emailType,
                        this.emailSubject,
                        this.recipient
                    )
                        .then(resolved => {
                            if(resolved){
                                Toasts.push({
                                    icon: 'happy',
                                    title: 'Woohoo!',
                                    message: this.successMessage
                                });

                                this.$emit('formSuccess');

                                this.loading = false;
                                this.valueInterface = '';
                            }
                        })
                }
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
    .loading-element {
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background-color:rgba(255,255,255,.8);
        @include flexCenter();
        font-size:32px;
        z-index:10;
    }
</style>