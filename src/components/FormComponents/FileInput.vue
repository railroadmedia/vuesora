<template>
    <div class="tw-file-field" :disabled="disabled">
        <label :for="id" 
               class="tw-btn-secondary tw-text-gray-400 sm:tw-btn-small"
               :aria-required="required"
               :aria-invalid="invalid"
               :aria-valid="valid"
        >
            <div class="tw-input-icon">
                <!-- Normal State -->
                <i class="fal fa-paperclip"></i>
                <!-- Heroicon name: solid/exclamation-circle -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="tw-invalid-icon" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <!-- Heroicon name: solid/checkmark-circle -->
                <svg xmlns="http://www.w3.org/2000/svg" class="tw-valid-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
            </div>
            {{ name + (multiple ? '(s)' : '') }}
            <input type="file" 
                   :id="id" 
                   :accept="accept"
                   @change="checkUploadedFile($event)">
        </label>
        <!-- Message -->
        <div class="tw-input-messages">
            <p class="tw-primary-message">{{ messageController }}</p>
            <p v-if="this.formState !== 2" class="tw-secondary-message">Max File Size {{ megabiteLimit }}MB</p>
        </div>
        <!-- Uploadedd Files -->
        <div v-if="files.length !== 0">
            <div v-for="(file, index) in files"
                 :key="index" 
                 class="tw-bg-green-50 tw-p-2 tw-inline-flex tw-items-center tw-font-bold tw-text-xs tw-w-full tw-mb-2"
            >
                <span class="tw-truncate">{{ files[index].name }}</span> 
                <span class="tw-ml-1 tw-text-gray-500 tw-mr-auto tw-whitespace-nowrap">({{ formatBytes(files[index].size) }})</span>
                <!-- Remove File -->
                <div class="tw-ml-4 tw-inline-flex"
                    @click="removeFile(index)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="tw-text-gray-500 tw-h-4 tw-w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FileInput',
    //props
    props: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        files: {
            type: Array,
            required: true
        },
        megabiteLimit: {
            type: Number,
            required: true
        },
        accept: {
            type: String,
            default: 'image/*'
        },
        required: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    // data
    data() {
        return {
            valid: false,
            invalid: false,
            selectedFile: '',
            formState: 0,
            fileInvalid: false,
        }
    },

    // methods
    methods: {
        checkUploadedFile(e) {
            const limit = (this.megabiteLimit * 1000000); //100mb == 100000000 bytes
            const fileTypes = [
                "video/mp4",
                "video/x-m4v",
                "video/quicktime",
                "image/apng", 
                "image/bmp", 
                "image/gif", 
                "image/jpeg", 
                "image/pjpeg", 
                "image/png", 
                "image/svg+xml", 
                "image/tiff", 
                "image/webp", 
                "image/x-icon", 
            ];


            if (!fileTypes.includes(e.target.files[0].type) || e.target.files[0].size > limit ) {
                this.invalidate()
                if(!fileTypes.includes(e.target.files[0].type) ) {
                    this.formState = 0;
                } else {
                    this.formState = 1;
                }
                if(!this.multiple) this.$emit('clearFiles')
                return;
            } else {
                this.validate()
                this.formState = 2; 
                if(!this.multiple) this.$emit('clearFiles')
                this.$emit('attachFile', e.target.files[0]);
            }
        },

        formatBytes(bytes) {
            bytes = bytes.toString().replace(/[^0-9.]/g, '');
            var sizes = ["B", "KB", "MB", "GB", "TB"];
            bytes = parseInt(bytes);
            if (bytes <= 0 || isNaN(bytes)) return "0 B";
            var i = Math.floor(Math.log(bytes) / Math.log(1024));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        },

        validate() {
            this.invalid = false;
            this.valid = true;
        },
        invalidate() {
            this.invalid = true;
            this.valid = false;
        },

        removeFile(index) {
            this.$emit('removeFile', index);
        },
    },

    // computed
    computed: {
        messageController() {
            //not uploaded
            if(this.formState === 0) return this.message;
            //too large
            if(this.formState === 1) return 'Your file size exceeds 100mb.';
            //uploaded
            if(this.formState === 2) return ''
        },
    },

    // lifecycle hooks
    watch: {
        files: function(Arr){
            if(Arr.length === 0 && !this.invalid) {
                this.valid = false;
                this.formState = 0;
            } 
        }
    }
}
</script>
