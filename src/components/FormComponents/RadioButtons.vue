<template>
    <fieldset class="tw-fieldset" 
              :aria-required="required"
              :aria-invalid="invalid" 
              :disabled="disabled"
    >
        <p class="tw-fieldset-title">
            <span v-if="required" class="tw-text-red-500">*</span>
            {{ name }}
        </p>
        <div class="tw-radio-group">
            <div v-for="(button,i) in buttonsList" 
                :key="i"
                class="tw-radio-field"
            >
                <input type="radio" 
                      :id="'radio-'+groupName+'-'+i" 
                      :name="groupName" 
                      :value="button.value"
                      v-model="selectedRadioButton">
                <label :for="'radio-'+groupName+'-'+i">{{ button.label }}</label>
            </div>
        </div>
        <p class="tw-input-message" id="">
           {{ errorMessage }}
        </p>
        <p class="tw-text-sm tw-italic tw-text-blue-500" v-show="showSelectMessage">{{ selectMessage }}</p>
    </fieldset>
</template>

<script>
export default {
    name: 'RadioButtons',
    //props
    props: {
        name: {
            type: String,
            required: true
        },
        groupName: {
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
            type: [Boolean, null],
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        showSelectMessage: {
            type: Boolean,
            default: false,
        },
        errorMessage: {
            type: String,
            default: ''
        },
        selectMessage: {
            type: String,
            default: ''
        },
        buttonsList: {
            type: Array,
            required: true
        }
    },

    // data
    data() {
        return {
            selectedRadioButton: '',
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
        },
    },

    watch: {
        selectedRadioButton: function(val) {
            this.$emit('updateValue', val);
            this.$emit('update:radioFieldsValid', true);
        },
    }

    // lifecycle hooks
}
</script>
