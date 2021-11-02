<template>
    <div class="tw-input-field"
         :disabled="disabled"
    >
        <label :for="id" class="tw-label">
            <span v-if="required" class="tw-text-red-500">*</span>
            {{ name }}
        </label>
        <div class="tw-input-wrapper">
            <textarea type="text" 
                    :id="id"
                    :rows="rows" 
                    :placeholder="placeholder"
                    class="focus:tw-border-drumeo tw-font-primary"
                    :class="[inputValue.length ? 'has-input' : '', !resize ? 'tw-resize-none' : 'tw-resize-y']"
                    :aria-required="required"
                    :aria-invalid="invalid"
                    v-model="valueInterface">
            </textarea>
            <span class="tw-input-icon">
                <!-- Invalid Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="tw-invalid-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </span>
            <p class="tw-input-message">{{ errorMessage }}</p>
        </div> 
    </div>
</template>

<script>
export default {
    name: 'TextareaInput',
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
        inputValue: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        },
        invalid: {
            type: Boolean,
            default: false
        },
        resize: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        rows: {
            type: Number,
            default: 4
        },
        placeholder: {
            type: String,
            default: ''
        },
        errorMessage: {
            type: String,
            default: ''
        }
    },

    // data
    data() {
        return {

        }
    },

    // methods
    methods: {

    },

    // computed
    computed: {
        //Value Interface
        valueInterface: {
            get() { return this.inputValue }, 
            set(val) { this.$emit('update:inputValue', val) }
        }
    },

    // lifecycle hooks
}
</script>
