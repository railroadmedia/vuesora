<template>
    <div class="flex flex-column">
        <schedule-item v-for="(item, i) in content"
                       :key="'schedule-item-' + item.id"
                       :$_item="item"
                       :$_timezone="$_timezone"></schedule-item>
    </div>
</template>
<script>
    import Utils from '../../assets/js/classes/utils';
    import ScheduleItem from './_ScheduleItem.vue'

    export default {
        name: 'content-schedule',
        props: {
            $_content: {
                type: Array,
                default: []
            },
            $_timezone: {
                type: String,
                default: 'America/Los_Angeles'
            }
        },
        computed: {
            content() {
                return Utils.flattenContent(this.$_content);
            }
        },
        components: {
            'schedule-item': ScheduleItem
        }
    }
</script>