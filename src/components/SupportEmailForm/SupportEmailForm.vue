<template>
    <form class="tw-flex tw-flex-col tw-my-4"
          novalidate="true"
          @submit.prevent="submitForm"
    >

        <!-- Help Dropdown -->
        <multilevel-dropdown 
            label="What can we help you with?"
            name="support-options"
            id="support-listbox"
            :theme="brand"
            :required="true"
            :invalid="formInvalid && selectFieldInvalid"
            :selectedValue="formData.supportOption"
            :listData="optionsData"
            @updateValue="updateSupportOption($event)"
            placeholder="Please select the option that is closest to your request..."
            errorMessage="Please select an option that is closest to your request."
        />

        <!-- Description -->
        <textarea-input 
            name="description"
            :required="true"
            :invalid="formInvalid && messageFieldInvalid"
            :resize="false"
            :rows="4"
            :inputValue="formData.message"
            @update:inputValue="formData.message = $event"
            id="support-description"
            placeholder="Add message here..."
            errorMessage="Please enter the details of your request."
        />

        <div class="tw-flex tw-full tw-flex-col sm:tw-flex-row-reverse">

            <div class="sm:tw-w-72">
                <!-- File Upload Button -->
                <file-input 
                    name="attach file"
                    id="support-file"
                    :required="false"
                    :disabled="false"
                    :multiple="false"
                    accept="video/*,image/*"
                    :files="formData.attachments"
                    message="For security reasons, we only accept image and video files."
                    :megabiteLimit="100"
                    @attachFile="attachFile($event)"
                    @removeFile="removeFile($event)"
                    @clearFiles="clearFiles()"
                />
            </div>

            <!-- SUBMIT BUTTON -->
            <button class="tw-btn-primary tw-self-start tw-mr-auto tw-w-full sm:tw-w-min" 
                    type="submit"
                    :disabled="formInvalid"
                    :class="themeBgClass" 
            >
                    Submit
            </button>

        </div>
    </form>
</template>

<script>
import UserService from '../../assets/js/services/user';
import Toasts from '../../assets/js/classes/toasts';
//Form Components
import TextareaInput from '../FormComponents/TextareaInput.vue'
import FileInput from '../FormComponents/FileInput.vue'
import MultiLevelDropdown from '../FormComponents/Dropdowns/MultiLevelDropdown.vue'

export default {
    name: 'SupportEmailForm',

    components: {
        'textarea-input': TextareaInput,
        'file-input': FileInput,
        'multilevel-dropdown': MultiLevelDropdown,
    },

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
            formInvalid: false,
            formData: {
               supportOption: '',
               message: '',
               attachments: [],
            },
            optionsData: [
                {
                    label: "Shipping & Orders",
                    selected: false,
                    options: [
                        {
                            label: 'My shipment tracking inquiry',
                            value: 'Shipping & Orders, My shipment tracking inquiry',
                            checked: false,
                        },
                        {
                            label: 'I received the wrong items',
                            value: 'Shipping & Orders, I received the wrong items',
                            checked: false,
                        },
                        {
                            label: 'Questions about shipping rates and fees',
                            value: 'Shipping & Orders, Questions about shipping rates and fees',
                            checked: false,
                        },
                        {
                            label: 'Other',
                            value: 'Shipping & Orders, Other',
                            checked: false,
                        }
                    ]
                },
                {
                    label: "Subscriptions & Membership",
                    selected: false,
                    options: [
                        {
                            label: 'Change or set up a subscription/membership',
                            value: 'Subscriptions & Membership, Change or set up a subscription/membership',
                            checked: false,
                        },
                        {
                            label: 'Subscription or pack inquiry',
                            value: 'Subscriptions & Membership, Subscription or pack inquiry',
                            checked: false,
                        },
                        {
                            label: 'Cancellation assistance',
                            value: 'Subscriptions & Membership, Cancellation assistance',
                            checked: false,
                        },
                        {
                            label: 'Refund assistance',
                            value: 'Subscriptions & Membership, Refund assistance',
                            checked: false,
                        },
                        {
                            label: 'Other',
                            value: 'Subscriptions & Membership, Other',
                            checked: false,
                        }
                    ]
                },
                {
                    label: "Billing & Payment",
                    selected: false,
                    options: [
                        {
                            label: 'Need assistance changing billing method or schedule',
                            value: 'Billing & Payment, Need assistance changing billing method or schedule',
                            checked: false,
                        },
                        {
                            label: 'Refund assistance',
                            value: 'Billing & Payment, Refund assistance',
                            checked: false,
                        },
                        {
                            label: 'Cancellation assistance',
                            value: 'Billing & Payment, Cancellation assistance',
                            checked: false,
                        },
                        {
                            label: 'Other',
                            value: 'Billing & Payment, Other',
                            checked: false,
                        }
                    ]
                },
                {
                    label: "Account Settings & Login",
                    selected: false,
                    options: [
                        {
                            label: 'Can\'t log in',
                            value: 'Account Settings & Login, Can\'t log in',
                            checked: false,
                        },
                        {
                            label: 'Other',
                            value: 'Account Settings & Login, Other',
                            checked: false,
                        }
                    ]
                },
                {
                    label: "Technical Issues",
                    selected: false,
                    options: [
                        {
                            label: 'Problems with mobile Android or iOS app',
                            value: 'Technical Issues, Problems with mobile Android or iOS app',
                            checked: false,
                        },
                        {
                            label: 'Content inaccessible or missing',
                            value: 'Technical Issues, Content inaccessible or missing',
                            checked: false,
                        },
                        {
                            label: 'Video Issues',
                            value: 'Technical Issues, Video Issues',
                            checked: false,
                        },
                        {
                            label: 'Other',
                            value: 'Technical Issues, Other',
                            checked: false,
                        }
                    ]
                },
                {
                    label: "Site Navigation & Lessons",
                    selected: false,
                    options: [
                        {
                            label: 'Question about a lesson or instrument',
                            value: 'Site Navigation & Lessons, Question about a lesson or instrument',
                            checked: false,
                        },
                        {
                            label: 'Assistance locating an area of the website',
                            value: 'Site Navigation & Lessons, Assistance locating an area of the website',
                            checked: false,
                        },
                        {
                            label: 'Other',
                            value: 'Site Navigation & Lessons, Other',
                            checked: false,
                        }
                    ]
                },
                {
                    label: "Other",
                    selected: false,
                    value: "Other"
                }
            ]
        };
    },
    computed: {
        messageFieldInvalid() {
            if(this.formData.message.length === 0 ) {
                return true;
            }
        },

        selectFieldInvalid() {
            if(this.formData.supportOption.length === 0) {
                return true;
            } 
        },

        themeBgClass() {
            return 'tw-bg-'+this.brand;
        },

        themeTextClass() {
            return 'tw-text-'+this.brand;
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
        updateSupportOption(val) {
            this.formData.supportOption = val;
        },

        attachFile(file) {     
            this.formData.attachments.push(file);
        },
        removeFile(index) {
            this.formData.attachments.splice(index, 1);
        },
        clearFiles() {
            this.formData.attachments = [];
        },


        checkForm() {
            this.formInvalid = this.messageFieldInvalid || this.selectFieldInvalid ? true : false;
        },

        submitForm() {
            console.log('hello? ', this.formData.attachments[0])
            //Check Form First
            this.checkForm()

            if(this.formInvalid) {
                console.log('form is invalid')
                return
            }

            //take snapshot
            const message = this.formData.message;
            const supportOption = this.formData.supportOption;
            let attachment; 
            //convert file(s) to image blobs 
            if(this.formData.attachments[0]) {
                attachment = this.formData.attachments[0];
            } else {
                attachment = null;
            }

            if (this.enableEvent) {
                this.$root.$emit(this.eventName, { text });
            }

            UserService.sendEmail({
                type: this.emailType,
                subject: this.emailSubject,
                lines: [supportOption, message], //array of lines to display in the email, new index = new line break
                attachment: attachment, //attachment only accepts one file, use 'attachments' to accept more than one
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

                        //reset option 
                        this.formData = {
                            supportOption: '',
                            message: '',
                            attachments: [],
                        }
                    }
                });
            
        },
    },

    watch: {
        selectFieldInvalid: function(invalid) {
            if(!invalid && !this.messageFieldInvalid) {
                this.formInvalid = false;
            }
        },
        messageFieldInvalid: function(invalid) {
            if(!invalid && !this.selectFieldInvalid) {
                this.formInvalid = false;
            }
        }
    }
};
</script>
