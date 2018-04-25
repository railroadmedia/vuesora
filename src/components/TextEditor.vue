<template>
    <tinymce-editor :init="initObject" tag-name="textarea"></tinymce-editor>
</template>
<script>
    import Editor from '@tinymce/tinymce-vue';

    export default {
        name: 'text-editor',
        props: {
            branding: {
                type: Boolean,
                default: () => false
            },
            height: {
                type: Number,
                default: () => 300
            },
        },
        computed: {
            pluginsArray() {

            },
            initObject() {
                return {
                    branding: this.branding,
                    height: this.height,
                    toolbar: 'bold italic underline | bullist numlist | link image media',
                    elementpath: false,
                    statusbar: false,
                    menubar: false,
                    resize: false,
                    plugins: 'lists link image media'
                }
            }
        },
        components: {
            'tinymce-editor': Editor
        }
    }
</script>
<style>

</style>