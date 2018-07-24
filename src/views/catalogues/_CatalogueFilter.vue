<template>
    <div class="flex flex-column ph catalogue-filter">
        <div class="form-group">
            <select :id="$_filter_name + 'Filter'"
                    :class="{'is-clearable sticky-label': valueInterface}"
                    v-model="valueInterface"
                    :disabled="valueInterface">
                <option selected disabled :value="null"></option>
                <option v-for="filter in $_item"
                        :key="filter.key"
                        :value="filter.value">
                    {{ filter.key }}
                </option>
            </select>

            <span v-if="valueInterface"
                  class="cancel-filter"
                  @click.stop="cancelFilter">
                <i class="fas fa-times"></i>
            </span>

            <label class="capitalize"
                   :class="$_themeColor"
                   :for="$_filter_name + 'Filter'">
                {{ $_filter_name }}
            </label>
        </div>
    </div>
</template>
<script>
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
            }
        },
        methods: {
            cancelFilter(){
                this.valueInterface = null;
            }
        }
    }
</script>
<style>

</style>