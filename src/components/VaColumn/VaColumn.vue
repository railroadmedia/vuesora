<template>
    <div class="flex flex-column"
         :class="$_classes"
         :style="$_widthStyles">
        <slot></slot>
    </div>
</template>
<script>
    export default {
        mixins: [],
        name: 'va-column',
        props: {
            alignV: { type: String },
            alignH: { type: String },
            width: { type: String|Number },
        },
        computed: {
            $_classes(){
                return {
                    ...this.$_alignmentClasses,
                }
            },

            $_widthStyles(){
                return {
                    '-webkit-box-flex': `0`,
                    '-ms-flex': `0 0 ${ this.width }px`,
                    'flex': `0 0 ${ this.width }px`,
                    'max-width': `${ this.width }px`,
                };
            },

            $_alignmentClasses(){
                return {
                    'align-v-center': this.alignV === 'center',
                    'align-v-bottom': this.alignV === 'bottom',
                    'align-v-top': this.alignV === 'top',
                    'align-h-center': this.alignH === 'center',
                    'align-h-left': this.alignH === 'left',
                    'align-h-right': this.alignH === 'right',
                }
            }
        }
    }
</script>