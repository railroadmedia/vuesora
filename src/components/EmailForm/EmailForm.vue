<template>
    <div class="flex flex-row">
        <div
            v-if="lessonPage"
            class="flex flex-row"
        >
            <div class="flex flex-column avatar-col hide-xs-only">
                <div class="square">
                    <img
                        class="rounded"
                        :src="userAvatar"
                    >
                </div>
            </div>
            <div class="flex flex-column input-col ph">
                <div class="form-group">
                    <input
                        id="questionInput"
                        v-model="valueInterface"
                        type="text"
                        class="borderless text-white"
                        :class="{ 'has-input': value.length }"
                    >
                    <label
                        for="questionInput"
                        :class="themeColor"
                    >{{ inputLabel }}</label>
                </div>
            </div>
            <div class="flex flex-column send-button-col">
                <a
                    class="btn text-white"
                    :class="themeBgClass"
                    @click="submitForm"
                >
                    <i class="fas fa-envelope"></i>
                    <span class="hide-xs-only ml-1">Send Question</span>
                </a>
            </div>
        </div>
        <div
            v-if="!lessonPage"
            class="flex flex-column relative"
        >
            <div
                v-if="loading"
                class="email-loading"
                :class="themeTextClass"
            >
                <i class="fas fa-spinner fa-spin"></i>
                <p class="x-tiny font-italic">
                    Loading Please Wait...
                </p>
            </div>
            <div class="form-group mb textarea">
                <textarea
                    id="questionBox"
                    v-model="valueInterface"
                    :class="{ 'has-input': value.length }"
                ></textarea>
                <label
                    for="questionBox"
                    :class="themeColor"
                >{{ inputLabel }}</label>
            </div>
            <div class="form-group">
                <button
                    class="btn"
                    @click="submitForm"
                >
                    <span
                        class="text-white"
                        :class="themeBgClass"
                    >
                        Submit
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import UserService from '../../assets/js/services/user';
import Toasts from '../../assets/js/classes/toasts';
import ThemeClasses from '../../mixins/ThemeClasses';

export default {
    name: 'EmailForm',
    mixins: [ThemeClasses],
    props: {
        brand: {
            type: String,
            default: () => 'musora',
        },

        recipient: {
            type: String,
            default: () => null,
        },

        emailType: {
            type: String,
            default: () => 'alert',
        },

        emailSubject: {
            type: String,
            default: () => '',
        },

        emailLogo: {
            type: String,
            default: () => 'https://dmmior4id2ysr.cloudfront.net/logos/musora-logo-white.png',
        },

        emailAlert: {
            type: String,
            default: () => null,
        },

        emailCallToActionText: {
            type: String,
            default: () => null,
        },

        emailCallToActionUrl: {
            type: String,
            default: () => null,
        },

        lessonPage: {
            type: Boolean,
            default: () => false,
        },

        userAvatar: {
            type: String,
            default: () => '',
        },

        inputLabel: {
            type: String,
            default: () => 'Ask a Question...',
        },

        successMessage: {
            type: String,
            default: () => 'Your email has been sent! Thank you for your input.',
        },

        emailEndpoint: {
            type: String,
            default: () => '/mailora/public/send',
        },

        enableEvent: {
            type: Boolean,
            default: () => false,
        },

        eventName: {
            type: String,
            default: () => 'emailFom',
        },
    },
    data() {
        return {
            value: '',
            loading: false,
        };
    },
    computed: {
        valueInterface: {
            get() {
                return this.value;
            },
            set(val) {
                this.value = val;
            },
        },

        callToAction() {
            if (this.emailCallToActionText && this.emailCallToActionUrl) {
                return {
                    text: this.emailCallToActionText,
                    url: this.emailCallToActionUrl,
                };
            }

            return null;
        },
    },
    methods: {
        submitForm() {
            if (this.value) {
                this.loading = true;

                if (this.enableEvent) {
                    this.$root.$emit(this.eventName, {text: this.value});
                }

                UserService.sendEmail({
                    type: this.emailType,
                    subject: this.emailSubject,
                    lines: [this.value],
                    callToAction: this.callToAction,
                    alert: this.emailAlert,
                    brand: this.brand,
                    logo: this.emailLogo,
                    recipient: this.recipient,
                    endpoint: this.emailEndpoint,
                })
                    .then((resolved) => {
                        if (resolved) {
                            Toasts.push({
                                icon: 'happy',
                                title: 'Woohoo!',
                                themeColor: this.themeColor,
                                message: this.successMessage,
                            });

                            this.$emit('formSuccess');
                            this.valueInterface = '';

                            window.closeAllModals();
                        }

                        this.loading = false;
                    });
            }
        },
    },
};
</script>
