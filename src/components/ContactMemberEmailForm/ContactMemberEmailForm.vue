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
            :invalid="!formValid && !selectFieldValid"
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
            :invalid="!formValid && !messageFieldValid"
            :resize="false"
            :rows="4"
            :inputValue="formData.message"
            @update:messageFieldValid="messageFieldValid = $event"
            @update:inputValue="formData.message = $event"
            id="support-description"
            placeholder="Add message here..."
        />

        <div class="tw-flex tw-flex-col-reverse sm:tw-flex-row tw-full">
            <div class="sm:tw-w-72 sm:tw-ml-auto">
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

        </div>

        <!-- SUBMIT BUTTON -->
        <button class="tw-btn-primary tw-self-start tw-mr-auto tw-w-full sm:tw-w-min" 
                type="submit"
                :disabled="!formValid"
                :class="themeBgClass" 
        >
                Submit
        </button>

        <!-- Response Message -->
        <div class="tw-flex tw-z-150 tw-fixed tw-rounded-lg tw-left-8 tw-p-6 tw-text-base tw-shadow-lg tw-mr-8 tw-transition-all tw-duration-200 tw-ease-in-out"
             :class="[responseMessageVisible ? 'tw-bottom-8': 'tw--bottom-44', formSuccessful ? 'tw-bg-green-50 tw-text-green-600' : 'tw-bg-red-50 tw-text-red-600']"
        >
            <svg v-if="formSuccessful" xmlns="http://www.w3.org/2000/svg" class="tw-h-6 tw-w-6 tw-text-green-500 tw-mr-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="tw-h-6 tw-w-6 tw-text-red-500 tw-mr-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div v-if="formSuccessful">
                <p class="tw-font-bold tw-mb-3">Your message was successfully sent!</p>
                <p class="tw-mb-2">Your message has been submitted to the support team and will be reviewed shortly</p>
                <p class="tw-font-bold tw-mb-2 tw-cursor-pointer" @click="responseMessageVisible = false">Dismiss</p>
            </div>
            <div v-else>
                <p class="tw-font-bold tw-mb-3">Your message was not sent</p>
                <p class="tw-mb-2">We could not submit your message to the support team due to a servor error. </p>
                <p class="tw-font-bold tw-mb-2 tw-cursor-pointer" @click="responseMessageVisible = false">Dismiss</p>
            </div>
        </div>
    </form>
</template>

<script>
import SupportService from '../../assets/js/services/support';
//Form Components
import TextareaInput from '../FormComponents/TextareaInput.vue'
import FileInput from '../FormComponents/FileInput.vue'
import MultiLevelDropdown from '../FormComponents/Dropdowns/MultiLevelDropdown.vue'

export default {
    name: 'ContactMemberEmailForm',

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
            formValid: true, //set true by default
            messageFieldValid: false,
            responseMessageVisible: false,
            formSuccessful: false,
            formData: {
                //name: '', todo: ensure removed
                //email: '', todo: ensure removed
                //isMember: null, todo: ensure removed
                supportOption: '',
                message: '',
                attachments: [],
            },
            buttonsList: [
                {
                    label: "Yes",
                    value: true,
                },
                {
                    label: "No",
                    value: false,
                }
            ],
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
        selectFieldValid() {
            return this.formData.supportOption.length !== 0 ? true : false;
        },
        
        formState() {
            if(this.messageFieldValid && this.selectFieldValid) return true;
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

        closeResponseMessage() {
            setTimeout(() => {
                this.responseMessageVisible = false;
            }, 3000);
        },

        submitForm() {
            //Check Form First
            this.formValid = this.formState;

            if(!this.formValid) {
                console.log('form is invalid')
                return
            }

            //take snapshot
            // const name = this.formData.name; # todo: ensure all mentions removed
            // const email = this.formData.email; # todo: ensure all mentions removed
            const message = this.formData.message;
            const supportOption = this.formData.supportOption;
            let attachment; 
            // let membership; # todo: ensure all mentions removed
            //convert file(s) to image blobs 
            if(this.formData.attachments[0]) {
                attachment = this.formData.attachments[0];
            } else {
                attachment = null;
            }

            if (this.enableEvent) {
                this.$root.$emit(this.eventName, { text });
            }

          SupportService.sendEmail({
                type: this.emailType,
                subject: this.emailSubject,
                // studentName: name,
                // studentEmail: email,
                // isMember: this.formData.isMember,
                supportOption: supportOption,
                message: message,
                attachment: attachment, //attachment only accepts one file, use 'attachments' to accept more than one
                callToAction: this.callToAction,
                brand: this.brand,
                logo: this.emailLogo,
                recipient: this.recipient,
                endpoint: this.emailEndpoint,
            })
                .then((resolved) => {
                    if (resolved) {
                        this.formSuccessful = true;
                        this.responseMessageVisible = true;

                        this.closeResponseMessage();

                        this.$emit('formSuccess');
                        window.closeAllModals();

                        //reset option 
                        this.formData = {
                            // name: '',
                            // email: '',
                            isMember: null,
                            supportOption: '',
                            message: '',
                            attachments: [],
                        }
                    } else {
                        this.formSuccessful = false;
                        this.responseMessageVisible = true;

                        this.closeResponseMessage()
                    }
                })
        },
    },

  /* * * * * * * * * * * *
  remove mentions of these
  ------------------------

  textFieldValid
  textField

  radioFieldsValid
  radioFields

  emailFieldValid
  emailField
  * * * * * * * * * */

    watch: {
        selectFieldValid: function(valid) {
            if(this.formState) {
                this.formValid = true;
            }
        },
        messageFieldValid: function(valid) {
            if(this.formState) {
                this.formValid = true;
            }
        },
    }
};
</script>
