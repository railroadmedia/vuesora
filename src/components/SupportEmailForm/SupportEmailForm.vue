<template>
    <form class="tw-flex tw-flex-col tw-my-4">

        <!-- Help Dropdown -->
        <div class="tw-input-field tw-nested-dropdown-field" >
            <label id="listbox-label" class="tw-label">
                <span class="tw-text-red-500">*</span>
                What can we help you with?
            </label>

            <div class="tw-input-wrapper">
                <!-- Dropdown Trigger / Label -->
                <button @click="dropdownMenuOpen = ! dropdownMenuOpen"
                        type="button"  
                        aria-haspopup="listbox" 
                        aria-expanded="true" 
                        aria-labelledby="listbox-label"
                        class="focus:tw-border-drumeo tw-text-sm tw-h-12 tw-transition-all tw-pr-12 tw-py-1 tw-leading-4"
                        :class="selectedOptionTitle ? 'tw-bg-gray-100' : 'tw-bg-white' "
                >
                    <span v-text="dropdownText"></span>
                    <span class="tw-input-icon tw-h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </span>
                </button>

                <!-- Clear input -->
                <button class="tw-h-12 tw-w-12 tw-border tw-border-solid tw-border-gray-300 tw-absolute tw-bg-white tw-top-0 tw-right-0 tw-flex tw-items-center tw-justify-center tw-p-0"
                        v-if="selectedOptionTitle"
                        @click="[selectedOptionTitle = '', selectedOption = '']"
                >
                    <span :class="themeTextClass" class="tw-h-6 tw-w-6 tw-cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="tw-h-6 tw-w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </span>
                </button>

                <!-- Separate the Dropdown from the Ul's - Make the container full width -->
                <div v-if="dropdownMenuOpen"
                     tabindex="-1"
                     class="tw-w-full tw-absolute tw-h-auto tw-border tw-border-solid tw-border-gray-200 tw-z-10 tw-mt-1 tw-shadow-lg tw-overflow-auto md:tw-border-none md:tw-shadow-none md:tw-h-64 md:tw-overflow-initial md:tw-mt-0"
                     @mouseleave="[activeOption = '', dropdownMenuOpen = false]"
                >
                    <ul class="tw-dropdown tw-text-sm tw-w-full tw-border-none tw-max-h-full tw-relative tw-overflow-initial tw-mt-0 tw-rounded-md md:tw-border md:tw-w-1/2 md:tw-mt-1"  
                        role="listbox" 
                        aria-labelledby="listbox-label" 
                        aria-activedescendant="listbox-option-3">

                        <li v-for="(option,index) in supportOptions" 
                            :key="option[index]"
                            class="tw-with-dropdown md:tw-bg-transparent"
                            :class="activeOption === index ? 'tw-bg-gray-200' : 'tw-bg-transparent'"
                            role="option"
                            @mouseover="openOnHover(index)"
                            @click="openOnClick(index)"
                        >   

                            <template v-if="option.value">
                                <input type="radio" :id="`option-${index}`" name="support_option" :value="option.value" v-model="selectedOption">
                                <label :for="`option-${index}`" 
                                        class="tw-option" 
                                        @click="[selectedOptionTitle = option.title]"
                                >
                                    <span>{{ option.title }}</span>
                                </label>
                            </template>
                            
                            <template v-else>
                                <span class="tw-option" @click="option.isOpen = !option.isOpen">{{ option.title }}</span>
                                <span class="tw-input-icon tw-h-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                         viewBox="0 0 20 20" 
                                         fill="currentColor" 
                                         class="tw-transform tw-rotate-90 md:tw-rotate-0" 
                                         :class="activeOption === index ? 'tw--rotate-90' : 'tw-rotate-90'">
                                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </span>
                            </template>

                            <!-- Sub navigation -->
                            <template v-if="option.subOptions">
                                <div v-if="activeOption === index" 
                                     class="tw-relative tw-w-full tw-z-1 md:tw-top-0 md:tw-left-full md:tw-pl-1 md:tw-absolute md:tw-h-auto"
                                     @mouseleave="closeOnHover()"
                                >
                                    <ul class="tw-dropdown tw-mt-0 tw-top-0 tw-text-sm tw-overflow-initial tw-relative tw-shadow-none tw-rounded-none tw-border-none md:tw-border md:tw-shadow-lg md:tw-rounded-md md:tw-ml-1">
                                        <li v-for="(subOption,index) in option.subOptions"
                                            :key="subOption[index]"
                                            role="option"
                                        >
                                            <input type="radio" :id="`suboption-${index}`" name="support_option" :value="subOption.value" v-model="selectedOption" class="tw-px-1">
                                            <label :for="`suboption-${index}`" 
                                                    class="tw-option" 
                                                    @click="[selectedOptionTitle = subOption.label]">
                                                <span>{{ subOption.label }}</span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </li>

                    </ul>
                </div>
            </div>
        </div>

        <!-- Description -->
        <div class="tw-input-field">
            <label for="questionBox" class="tw-label tw-font-bold tw-text-black tw-pl-0 tw-mb-2">
                <span class="tw-text-red-500">*</span>
                Description
            </label>
            <div class="tw-input-wrapper">
                <textarea type="text" 
                        id="questionBox"
                        rows="4" 
                        v-model="messageValue"
                        class="focus:tw-border-drumeo tw-h-auto tw-text-sm"
                        :class="{ 'has-input': messageValue.length }"
                        placeholder="Add message here..."
                        @keyup="checkForm()"
                        @blur="checkForm()">
                </textarea>
            </div>
        </div>

        <div class="tw-flex tw-full tw-flex-col sm:tw-flex-row-reverse">

            <!-- File Upload Button -->
            <div class="tw-m-0 tw-mb-8 sm:tw-mb-0">
                <div class="tw-input-field tw-mb-1">
                    <label for="supportFile" class="tw-btn-secondary tw-text-gray-400 tw-w-full sm:tw-btn-small sm:tw-w-min">
                        <i class="fal fa-paperclip tw-mr-2"></i>
                        Attach File
                    </label>
                    <input type="file" 
                           class="tw-hidden" 
                           id="supportFile" 
                           accept="video/*,image/*"
                           :value="selectedFile"
                           @change="checkUploadedFile($event)">
                </div>
                <!-- Message -->
                <div class="text-center tw-font-roboto-condensed tw-text-base tw-italic">
                    <p class="tw-w-full sm:tw-w-52">{{ fileMessage }}</p>
                    <p class="tw-text-gray-400">Max File Size 100MB</p>
                </div>
            </div>

            <!-- Submit -->
            <button class="tw-btn-primary tw-self-start tw-mr-auto tw-w-full sm:tw-w-min" 
                    type="submit"
                    :disabled="formInvalid"
                    :class="themeBgClass" 
                    @click="submitForm">
                    Submit
            </button>

        </div>

    </form>
</template>

<script>
import UserService from '../../assets/js/services/user';
import Toasts from '../../assets/js/classes/toasts';

export default {
    name: 'SupportEmailForm',
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
            formInvalid: true,
            selectedFile: '',
            fileMessage: 'For security reasons, we only accept image and video files.',
            messageValue: '',
            dropdownMenuOpen: false,
            selectedOption: '',
            selectedOptionTitle: '',
            activeOption: '',
            supportOptions: [
                {
                    title: "Shipping & Orders",
                    isOpen: false,
                    subOptions: [
                        {
                            label: 'My shipment tracking inquiry',
                            value: 'shipping_tracking'
                        },
                        {
                            label: 'I received the wrong items',
                            value: 'shipping_items'
                        },
                        {
                            label: 'Questions about shipping rates and fees',
                            value: 'shipping_rates'
                        },
                        {
                            label: 'Other shipping / orders question',
                            value: 'shipping_other'
                        }
                    ]
                },
                {
                    title: "Subscriptions & Membership",
                    isOpen: false,
                    subOptions: [
                        {
                            label: 'Change or set up a subscription/membership',
                            value: 'subscription_update'
                        },
                        {
                            label: 'Subscription or pack inquiry',
                            value: 'subscription_inquiry'
                        },
                        {
                            label: 'Cancellation assistance',
                            value: 'subscription_cancel'
                        },
                        {
                            label: 'Refund assistance',
                            value: 'subscription_refund'
                        },
                        {
                            label: 'Other subscription / membership question',
                            value: 'subscription_other'
                        }
                    ]
                },
                {
                    title: "Billing & Payment",
                    isOpen: false,
                    subOptions: [
                        {
                            label: 'Need assistance changing billing method or schedule',
                            value: 'billing_change'
                        },
                        {
                            label: 'Refund assistance',
                            value: 'billing_refund'
                        },
                        {
                            label: 'Cancellation assistance',
                            value: 'billing_cancel'
                        },
                        {
                            label: 'Other billing / payment question',
                            value: 'billing_other'
                        }
                    ]
                },
                {
                    title: "Account Settings & Login",
                    isOpen: false,
                    subOptions: [
                        {
                            label: 'Can\'t log in',
                            value: 'account_login'
                        },
                        {
                            label: 'Other account / login question',
                            value: 'account_other'
                        }
                    ]
                },
                {
                    title: "Technical Issues",
                    isOpen: false,
                    subOptions: [
                        {
                            label: 'Problems with mobile Android or iOS app',
                            value: 'issues_mobile'
                        },
                        {
                            label: 'Content inaccessible or missing',
                            value: 'issues_content'
                        },
                        {
                            label: 'Video Issues',
                            value: 'issues_video'
                        },
                        {
                            label: 'Other technical issues',
                            value: 'issues_other'
                        }
                    ]
                },
                {
                    title: "Site Navigation & Lessons",
                    isOpen: false,
                    subOptions: [
                        {
                            label: 'Question about a lesson or instrument',
                            value: 'navigation_content'
                        },
                        {
                            label: 'Assistance locating an area of the website',
                            value: 'navigation_site'
                        },
                        {
                            label: 'Other lessons question',
                            value: 'navigation_other'
                        }
                    ]
                },
                {
                    title: "Other",
                    value: 'other'
                }
            ]
        };
    },
    computed: {

        themeBgClass() {
            return 'tw-bg-'+this.brand;
        },

        themeTextClass() {
            return 'tw-text-'+this.brand;
        },

        dropdownText() {
            return this.selectedOptionTitle || 'Please select the option that is closest to your request...'
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
        openOnHover(index) {
            const medium = '(min-width: 768px)';
            if(window.matchMedia(medium).matches){
                this.activeOption = index;
            }
        },
        closeOnHover() {
            const medium = '(min-width: 768px)';
            if(window.matchMedia(medium).matches){
                this.activeOption = '';
            }
        },
        closeDropdowns() {
            this.activeOption = '', this.dropdownMenuOpen = false
        },
        openOnClick(index) {
            const small = '(max-width: 767px)';
            if(window.matchMedia(small).matches){
                if(this.activeOption === index) {
                    this.activeOption = '';
                } else {
                    this.activeOption = index;
                } 
            }
        },
        checkUploadedFile(e) {
            console.log('check uploaded file');
            const file = e.target.files[0];
            const limit = 100000000; //100mb
            const allowedExtensions = /(\.apng|\.avif|\.gif|\.jpg|\.jpeg|\.jfif|\.pjpeg|\.pjp|\.png|\.svg|\.webp|)$/i;

            console.log(this.selectedFile);
            if (!allowedExtensions.exec(file)) {
                console.log('wrong format')
                this.selectedFile = '';
                this.fileMessage = "For security reasons, we only allow image and video files."
                return false;
            } else if( file.size > limit ) {
                console.log('too large')
                this.selectedFile = '';
                this.fileMessage = "Your file size exceeds 100mb."
                return false;
            } else {
                console.log('all good');
                console.log(this.selectedFile);
                // this.selectedFile = file;
                // this.fileMessage = ""
            }
        },
        checkForm() {
            if(this.messageValue.length !== 0 && this.selectedOption !== '') {
                this.formInvalid = false;
            } else {
                this.formInvalid = true;
            }
        },
        submitForm() {
            if (this.messageValue) {
                const text = this.messageValue;

                if (this.enableEvent) {
                    this.$root.$emit(this.eventName, { text });
                }

                this.messageValue = '';

                UserService.sendEmail({
                    type: this.emailType,
                    subject: this.emailSubject,
                    lines: [text],
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

                            window.closeAllModals();
                        }
                    });
            }
        },
    },
};
</script>
