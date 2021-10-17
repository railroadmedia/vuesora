<template>      
    <!-- Help Dropdown -->
    <div class="tw-input-field tw-nested-dropdown-field" >
        <label id="listbox-label" class="tw-label">
            <span class="tw-text-red-500" v-if="required">*</span>
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
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    setup() {
        
    },
})
</script>
