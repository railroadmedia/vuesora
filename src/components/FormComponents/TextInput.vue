<template>
    <div class="tw-input-field"
        :disabled="disabled"
    >
        <label :for="id" class="tw-label">
            <span v-if="required" class="tw-text-red-500">*</span>
            {{ name }}
        </label>
        <div class="tw-input-wrapper">
            <input  type="text" 
                    :id="id"
                    :placeholder="placeholder"
                    class="focus:tw-border-drumeo"
                    :aria-required="required"
                    :aria-invalid="invalid"
                    v-model="valueInterface"
                    aria-describedby=""
            >
            <div class="tw-input-icon">
                <!-- Heroicon name: solid/exclamation-circle -->
                <svg xmlns="http://www.w3.org/2000/svg" class="tw-invalid-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </div>
            <p class="tw-input-message" id="">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TextInput',
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
        disabled: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: ''
        }
    },

    // data
    data() {
        return {
            errorMessage: 'Please enter your name.',
        }
    },

    // methods
    methods: {
        validateInput: function(input) {
            if (!input.length) {
                this.errorMessage = "Please enter your name."
                this.$emit('update:textFieldValid', false)
            } else {
                this.errorMessage = '';
                this.$emit('update:textFieldValid', true)
            }
        }
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
    watch: {
        inputValue: function(val) {
            this.validateInput(val);
        },
        invalid: function() {
           this.validateInput(this.inputValue); 
        }
    },

    // lifecycle hooks
}
</script>
