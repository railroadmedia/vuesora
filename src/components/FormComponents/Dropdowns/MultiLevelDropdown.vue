<template>
    <div class="tw-input-field" :disabled="disabled">
        <label :id="id" class="tw-label">
            <span v-if="required" class="tw-text-red-500">*</span>
            {{ name }}
        </label>

        <div class="tw-input-wrapper">
            <!-- Dropdown Trigger / Label -->
            <button type="button"
                    class="focus:tw-border-drumeo tw-text-sm tw-h-12 tw-transition-all tw-py-1 tw-leading-4"
                    :class="selectedValue ? 'tw-bg-gray-100' : 'tw-bg-white' "
                    @click="dropdownMenuOpen = ! dropdownMenuOpen"
                    aria-haspopup="listbox" 
                    aria-expanded="true" 
                    :aria-labelledby="id"
                    :aria-required="required"
                    :aria-invalid="invalid"
                    ref="dropdownButton"
                    tabindex="0"
            >
                <!-- Dropdown Selected Text -->
                <span v-text="selectedValue || placeholder"></span>

                <!-- Icons -->
                <span class="tw-input-icon">
                    <!-- Heroicon name: solid/exclamation-circle -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="tw-invalid-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <!-- Heroicon name: solid/chevron-down -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </span>
            </button>

            <!-- Clear input -->
            <button class="focus:tw-border-drumeo tw-h-12 tw-w-12 tw-border tw-border-solid tw-border-gray-300 tw-absolute tw-bg-white tw-top-0 tw-right-0 tw-flex tw-items-center tw-justify-center tw-p-0"
                    v-if="selectedValue"
                    tabindex="0"
                    @click="clearSelectedValue()"
            >
                <span :class="themeTextClass" class="tw-h-6 tw-w-6 tw-cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="tw-h-6 tw-w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </span>
            </button>

            <!-- Separate the Dropdown from the Ul's - Make the container full width -->
            <div v-show="dropdownMenuOpen"
                 tabindex="-1"
                 @mouseleave="closeDropdowns()"
                 class="tw-dropdown-wrapper tw-w-full md:tw-w-auto tw-absolute tw-h-auto tw-border tw-border-solid tw-border-gray-200 tw-z-10 tw-shadow-lg tw-overflow-auto md:tw-border-none md:tw-shadow-none md:tw-h-64 md:tw-overflow-initial md:tw-mt-0"
            >
                <ul class="tw-dropdown tw-text-sm tw-w-full tw-border-none tw-max-h-full tw-relative tw-overflow-initial tw-mt-0 tw-rounded-md md:tw-border md:tw-w-72"  
                    role="listbox" 
                    :aria-labelledby="id" 
                    aria-activedescendant="listbox-option-3"
                >

                    <li v-for="(category,catindex) in listData" 
                        :key="catindex"
                        class="tw-with-dropdown md:tw-bg-transparent"
                        :class="activeCategory === catindex ? 'tw-bg-gray-200' : 'tw-bg-transparent'"
                    >   
                        <!-- no submenu -->
                        <template v-if="!category.options">
                            <label :for="`category-${catindex}`" 
                                    class="tw-option" 
                                    :class="category.value === selectedCategory ? 'tw-bg-drumeo tw-text-white' : ''"
                                    tabindex="0"
                                    role="option"
                                    @mouseover="activeCategory = ''"
                            >
                                <span>{{ category.label }}</span>
                            </label>
                            <input type="radio" 
                                :id="`category-${catindex}`" 
                                :name="name" 
                                :value="category.value" 
                                :checked="category.value === selectedCategory"
                                v-model="selectedCategory"
                                @change="category.value = selectedCategory, selectedOption = ''"
                            >
                        </template>
                        
                        <template v-else>
                            <div class="tw-option" 
                                 tabindex="0"                        
                                 @mouseover="openOnHover(catindex)"
                                 @click="openOnClick(catindex)"
                                 @keyup.enter="openOnClick(catindex)"
                            >
                                <span>{{ category.label }}</span>
                                <span class="tw-input-icon tw-h-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 20 20" 
                                            fill="currentColor" 
                                            class="tw-transform tw-rotate-90 md:tw-rotate-0" 
                                            :class="activeCategory === category.label ? 'tw--rotate-90' : 'tw-rotate-90'">
                                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </span>
                            </div>
                        </template>

                        <!-- Sub navigation -->
                        <template v-if="category.options">
                            <div v-if="activeCategory === catindex" 
                                 class="tw-relative tw-w-full tw-z-1 md:tw-top-0 md:tw-left-full md:tw-pl-1 md:tw-absolute md:tw-h-auto"
                                 @mouseleave="closeOnHover()"
                            >
                                <ul class="tw-dropdown tw-subdropdown tw-mt-0 tw-top-0 tw-text-sm tw-overflow-initial tw-relative tw-shadow-none tw-rounded-none tw-border-none md:tw-border md:tw-shadow-lg md:tw-rounded-md md:tw-ml-1">
                                    <li v-for="(option, optindex) in category.options"
                                        :key="optindex"
                                    >
                                        <label :for="`option-${optindex}`" 
                                                class="tw-option" 
                                                :class="option.value === selectedOption && category.label === selectedCategory ? 'tw-bg-drumeo tw-text-white' : ''"
                                                tabindex="0"
                                                role="option"
                                        >
                                            <span>{{ option.label }}</span>
                                        </label>
                                        <input type="radio" 
                                            :id="`option-${optindex}`" 
                                            :name="name" 
                                            :value="option.value"
                                            :checked="option.value === selectedOption"
                                            v-model="selectedOption"
                                            @change="selectedCategory = category.label, selectedOption = option.value"
                                        >
                                    </li>
                                </ul>
                            </div>
                        </template>

                    </li>
                </ul>
            </div>

            <!-- Error Message -->
            <p class="tw-input-message">{{ errorMessage }}</p>
        </div>

        
    </div>
</template>

<script>
export default {
    name: 'MultiLevelDropdown',
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
        label: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            default: 'Select an Option',
        },
        listData: {
            type: Array,
            required: true
        },
        selectedValue: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        invalid: {
            type: Boolean,
            default: false
        },
        errorMessage: {
            type: String,
            default: ''
        },
        theme: {
            type: String,
            default: ''
        }
    },

    // data
    data() {
        return {
            dropdownMenuOpen: false,
            activeCategory: '',
            selectedCategory: '',
            selectedOption: '',
        }
    },

    // methods
    methods: {
        log(option){
            console.log(option)
        },
        openOnHover(label) {
            const medium = '(min-width: 768px)';
            if(window.matchMedia(medium).matches){
                this.activeCategory = label;
            }
        },
        openOnClick(label) {
            const small = '(max-width: 767px)';
            if(window.matchMedia(small).matches){
                if(this.activeCategory === label) {
                    this.activeCategory = '';
                } else {
                    this.activeCategory = label;
                } 
            } else {
                this.activeCategory = label;
            } 
        },
        closeOnHover() {
            const medium = '(min-width: 768px)';
            if(window.matchMedia(medium).matches){
                this.activeCategory = '';
            }
        },
        closeDropdowns() {
            this.dropdownMenuOpen = false;
            this.activeCategory = '';
        },
        clearSelectedValue() {
            this.selectedCategory = '';
            this.selectedOption = '';
        }
    },

    // computed
    computed: {
        themeBgClass() {
            return 'tw-bg-'+this.brand;
        },
        themeTextClass() {
            return 'tw-text-'+this.brand;
        },
    },

    //watchers
    watch: {
        selectedCategory: function(val) {
            this.$emit('updateValue', val)
        },
        selectedOption: function(val) {
            this.$emit('updateValue', val);
        },
        selectedValue: function(value) {
            if(!value.length) {
                this.clearSelectedValue();
            }
        } 
    }
}
</script>