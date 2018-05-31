<template>
    <div class="container narrow pt-3">
        <h1 class="heading text-center">Text Editor</h1>
        <p class="body font-light mb-3 text-center">A Custom WYSIWYG editor extending the TinyMCE library.</p>

        <text-editor imageUploadEndpoint="/endpoint" :initialValue="initialValue"></text-editor>

        <div class="flex flex-column bg-white shadow corners-3 pa mv-4">
            <h2 class="subheading text-secondary mb">Props</h2>

            <table class="body">
                <thead class="bg-primary text-white">
                <tr>
                    <td class="pa-1 corners-top-5">Prop</td>
                    <td class="pa-1 corners-top-5">Required</td>
                    <td class="pa-1 corners-top-5">Type</td>
                    <td class="pa-1 corners-top-5">Default</td>
                    <td class="pa-1 corners-top-5">Description</td>
                </tr>
                </thead>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">height</td>
                    <td class="pa-1">No</td>
                    <td class="pa-1">Number</td>
                    <td class="pa-1">300</td>
                    <td class="pa-1">The default and minimum height of the text area</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">toolbar</td>
                    <td class="pa-1">No</td>
                    <td class="pa-1">String</td>
                    <td class="pa-1">'bold italic underline | bullist numlist | link image media'</td>
                    <td class="pa-1">The string representing the toolbar options, additional options and format can be seen <a href="https://www.tinymce.com/docs/configure/editor-appearance/#toolbar" target="_blank">here.</a></td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">imageUploadEndpoint</td>
                    <td class="pa-1">No</td>
                    <td class="pa-1">String</td>
                    <td class="pa-1 font-italic">undefined</td>
                    <td class="pa-1">The endpoint for image uploads to be sent. Choosing not to use this prop will result in no upload functionality</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">initialValue</td>
                    <td class="pa-1">No</td>
                    <td class="pa-1">String</td>
                    <td class="pa-1 font-italic">undefined</td>
                    <td class="pa-1">The intial value to render the editor with, accepts an html template string as its argument</td>
                </tr>
                <tr class="bg-light">
                    <td class="pa-1 font-bold">fieldKey</td>
                    <td class="pa-1">No</td>
                    <td class="pa-1">String</td>
                    <td class="pa-1 font-italic">'content'</td>
                    <td class="pa-1">The key to be used as the form name or key for async requests</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import VEmbed from 'vue-embed';
    import TextEditor from "@/components/TextEditor.vue";

    export default {
        name: "home",
        props: {

        },
        data() {
            return {
                initialValue: '<blockquote data-post-id="1234">' +
                '<p class="quote-heading"><strong>Curtis Conway</strong><em> - Oct 16, 2017</em></p><br>' +
                '<p>This is a test, just checking</p>' +
                '<p>what happens</p>' +
                '<p>when I make a template like this</p>' +
                '<br><p></p>' +
                '<blockquote data-post-id="1234">' +
                '<p class="quote-heading"><strong>Curtis Conway</strong><em> - Oct 16, 2017</em></p><br>' +
                '<p>This is a test, just checking</p>' +
                '<p>what happens</p>' +
                '<p>when I make a template like this</p>' +
                '</blockquote>' +
                '</blockquote>' +
                '<br><p></p>'
            }
        },
        components: {
            "text-editor": TextEditor,
            "v-embed": VEmbed
        }
    };
</script>

<style lang="scss">
</style>
