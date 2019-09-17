<template>
    <div class="flex flex-column ph-1 catalogue-filter">
        <div class="form-group">
            <select
                :id="filterName + 'Filter'"
                v-model="valueInterface"
                class="no-label"
                :class="{'is-clearable': valueInterface}"
                :disabled="valueInterface"
                @keydown.prevent
            >
                <option
                    selected
                    disabled
                    :value="null"
                >
                    {{ placeholderLabel }}
                </option>
                <option
                    v-for="filter in sortedOptions"
                    :key="filter.key"
                    :value="filter.value"
                >
                    {{ toTitleCase(filter.key) }}
                </option>
            </select>

            <span
                v-if="valueInterface"
                class="cancel-filter"
                @click.stop="cancelFilter"
            >
                <i
                    class="fas fa-times"
                    :class="'text-' + themeColor"
                ></i>
            </span>
        </div>
    </div>
</template>
<script>
import Utils from '../../assets/js/classes/utils';

export default {
    name: 'CatalogueFilter',
    props: {
        filterName: {
            type: String,
            default: () => '',
        },
        item: {
            type: Array,
            default: () => [],
        },
        themeColor: {
            type: String,
            default: () => 'drumeo',
        },
        initialValue: {
            type: [String, Number],
            default: () => null,
        },
        loading: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            filter_value: this.initialValue,
        };
    },
    computed: {
        valueInterface: {
            cache: false,
            get() {
                return this.initialValue;
            },
            set(value) {
                this.filter_value = value;

                this.$emit('filterChange', {
                    key: this.filterName,
                    value: this.filter_value,
                });
            },
        },

        sortedOptions() {
            return this.item;
        },

        placeholderLabel() {
            const labelMap = {
                difficulty: 'Choose a Level...',
                instructor: 'Choose an Instructor...',
                topic: 'Choose a Topic...',
                progress: 'Your Progress...',
                artist: 'Choose an Artist...',
                style: 'Choose a Style...',
                bpm: 'Choose a Tempo...',
                type: 'Choose a Type...',
                key: 'Choose a Key...',
                key_pitch_type: 'Choose a Type...',
            };

            return labelMap[this.filterName];
        },
    },
    methods: {
        cancelFilter() {
            if (!this.loading) {
                this.valueInterface = null;
            }
        },
        toTitleCase: phrase => Utils.toTitleCase(phrase),
    },
};
</script>
<style>

</style>
