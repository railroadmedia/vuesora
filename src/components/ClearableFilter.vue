<template>
    <div class="clearable-filter flex flex-column">
        <label
            :for="elementId"
            class="capitalize ba-light-1 bg-white corners-3 pa"
            :class="active ? 'active' : ''"
        >
            <span :class="active ? 'text-recordeo' : 'text-black'">
                {{ parsedLabelText }}

                <i
                    class="fas flex-center"
                    :class="active ? 'fa-times' : 'fa-caret-down'"
                    @click="closeFilter"
                ></i>
            </span>
        </label>
        <select
            :id="elementId"
            v-model="activeFilterInterface"
        >
            <option
                disabled
                selected
                style="display:none;"
                value="0"
            ></option>
            <option
                v-for="(option, i) in filterOptions"
                :key="i"
                :value="option.value"
            >
                {{ option.label }}
            </option>
        </select>
    </div>
</template>
<script>
export default {
    name: 'ClearableFilter',
    props: {
        elementId: {
            type: String,
            default: () => '',
        },
        labelText: {
            type: String,
            default: () => '',
        },
        filterOptions: {
            type: Array,
            default: () => [],
        },
        initialValue: {
            type: String,
            default: () => '',
        },
    },
    data() {
        return {
            active: this.initialValue != 0,
            activeFilter: this.initialValue,
        };
    },
    computed: {

        parsedLabelText() {
            if (this.active) {
                return this.filterOptions.filter(option => option.value === this.activeFilter)[0].label;
            }

            return this.labelText;
        },

        activeFilterInterface: {
            get() {
                return this.activeFilter;
            },
            set(val) {
                if (val === '0') {
                    this.active = false;
                    this.activeFilter = '0';
                } else {
                    this.active = true;
                    this.activeFilter = val;
                }

                this.$emit('change', {
                    value: val,
                });
            },
        },
    },

    methods: {
        closeFilter() {
            this.activeFilterInterface = '0';
        },
    },
};
</script>
<style lang="scss" scoped>
    @import '../assets/sass/partials/_variables.scss';

    .clearable-filter {
        position:relative;

        select, label {
            position:absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;
        }

        select {
            z-index:1;
        }

        label {
            z-index:2;
            color:inherit;
            pointer-events:none;

            &.active {
                pointer-events:auto;

                i {
                    cursor:pointer;
                }
            }

            i {
                height:50px;
                width:50px;
                position:absolute;
                top:0;
                right:0;
            }
        }
    }
</style>
