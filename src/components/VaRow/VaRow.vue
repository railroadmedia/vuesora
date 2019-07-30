<template>
    <div
        class="flex flex-row"
        :class="$_classes"
    >
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'VaRow',
    mixins: [],
    inheritAttrs: true,
    props: {
        alignV: { type: String },
        alignH: { type: String },
        wrap: { type: Boolean, default: () => false },
    },
    computed: {
        $_classes() {
            return {
                'flex-wrap': this.wrap,
                ...this.$_alignmentClasses,
            };
        },

        $_alignmentClasses() {
            return {
                'align-v-center': this.alignV === 'center',
                'align-v-bottom': this.alignV === 'bottom',
                'align-v-top': this.alignV === 'top',
                'align-h-center': this.alignH === 'center',
                'align-h-left': this.alignH === 'left',
                'align-h-right': this.alignH === 'right',
            };
        },
    },
};
</script>
