<template>
    <div class="flex flex-column ph-1 catalogue-filter">
        <div class="form-group">
            <select
                :id="filter_name + 'Filter'"
                v-model="valueInterface"
                class="no-label"
                :class="{'is-clearable': valueInterface}"
                :disabled="valueInterface"
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
                    {{ toTitleCase(filter.key.replace(/-/g, ' ')) }}
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

            <!--<label class="capitalize"-->
            <!--:class="themeColor"-->
            <!--:for="filter_name + 'Filter'">-->
            <!--{{ filter_name }}-->
            <!--</label>-->
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
            default: () => null,
        },
        loading: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            filter_value: this.initial_value,
        };
    },
    computed: {
        valueInterface: {
            cache: false,
            get() {
                return this.initial_value;
            },
            set(value) {
                this.filter_value = value;

                this.$emit('filterChange', {
                    key: this.filter_name,
                    value: this.filter_value,
                });
            },
        },

        sortedOptions() {
            return this.item;
        },

        placeholderLabel() {
            const label_map = {
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

            return label_map[this.filter_name];
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
