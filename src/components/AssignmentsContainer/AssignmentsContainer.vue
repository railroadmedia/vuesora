<template>
    <div class="flex flex-column">
        <div v-for="assignment in assignments" :key="assignment.id" class="flex flex-row">
            <div class="flex flex-column grow bt-grey-1-1">
                <ContentAssignment
                    :theme-color="assignment.themeColor"
                    :timecode="assignment.timecode"
                    :id="assignment.id"
                    :title="assignment.title"
                    :soundslice-slug="assignment.soundsliceSlug"
                    :completed="assignment.completed"
                    :user-id="assignment.userId"
                    :position="assignment.index"
                >
                </ContentAssignment>
            </div>
        </div>
    </div>
</template>

<script>
import ContentAssignment from '../ContentAssignment/ContentAssignment';

export default {
    name: 'AssignmentsContainer',
    components: {
        ContentAssignment,
    },
    props: {
        assignments: {
            type: Array,
            default: () => [],
        },
    },
    mounted() {
        console.log(this.assignments)
    }
};
</script>
