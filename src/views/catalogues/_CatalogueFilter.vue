<template>
    <div class="flex flex-column ph-1 catalogue-filter">
        <div class="form-group">
            <select :id="$_filter_name + 'Filter'"
                    class="no-label"
                    :class="{'is-clearable': valueInterface}"
                    v-model="valueInterface"
                    :disabled="valueInterface">
                <option selected disabled :value="null">
                    {{ $_placeholderLabel + '...' }}
                </option>
                <option v-for="filter in $_item"
                        :key="filter.key"
                        :value="filter.value">
                    {{ toTitleCase(filter.key) }}
                </option>
            </select>

            <span v-if="valueInterface"
                  class="cancel-filter"
                  @click.stop="cancelFilter">
                <i class="fas fa-times"
                   :class="'text-' + $_themeColor"></i>
            </span>

            <!--<label class="capitalize"-->
                   <!--:class="$_themeColor"-->
                   <!--:for="$_filter_name + 'Filter'">-->
                <!--{{ $_filter_name }}-->
            <!--</label>-->
        </div>
    </div>
</template>
<script>
    import Utils from '../../assets/js/classes/utils';

    export default {
        name: 'catalogue-filter',
        props: {
            $_filter_name: {
                type: String,
                default: () => ''
            },
            $_item: {
                type: Array,
                default: () => []
            },
            $_themeColor: {
                type: String,
                default: () => 'drumeo'
            },
            loading: {
                type: Boolean,
                default: () => false
            }
        },
        data(){
            return {
                filter_value: null
            }
        },
        computed: {
            valueInterface: {
                get(){
                    return this.filter_value;
                },
                set(value){
                    this.filter_value = value;

                    this.$emit('filterChange', {
                        key: this.$_filter_name,
                        value: this.filter_value
                    });
                }
            },

            $_placeholderLabel(){
                const label_map = {
                    difficulty: 'Choose a Level',
                    instructor: 'Choose an Instructor',
                    topic: 'Choose a Topic',
                    progress: 'Your Progress',
                    artist: 'Choose an Artist',
                    style: 'Choose a Style',
                    bpm: 'Choose a Tempo'
                };

                return label_map[this.$_filter_name];
            }
        },
        methods: {
            cancelFilter(){
                if(!this.loading){
                    this.valueInterface = null;
                }
            },
            toTitleCase: (phrase) => Utils.toTitleCase(phrase)
        }
    }
</script>
<style>

</style>