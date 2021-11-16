<template>
    <div class="flex flex-column">
        <div v-for="(assignment, index) in assignments" :key="assignment.id" class="flex flex-row" dusk="assignments">
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
                    :force-open="forceIndex === index"
                    :disable-prev="assignments[index - 1] && !assignments[index - 1].soundsliceSlug"
                    :disable-next="assignments[index + 1] && !assignments[index + 1].soundsliceSlug"
                    v-on:force-prev="forceIndex = forceIndex - 1"
                    v-on:force-next="forceIndex = forceIndex + 1"
                    v-on:force-current="forceIndex = index"
                >
                </ContentAssignment>
            </div>
        </div>
        <slot name="completion-bonus"></slot>
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
    data() {
        return {
            forceIndex: null,
        };
    },
};
</script>
