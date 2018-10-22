<template>
    <div class="flex flex-row">
        <textarea ref="editorElement" name="content">
            Top musicians, top gear, top fine tuned for the song & top room. Need top song, top engineers, top producer, top recording gear, top copyright and top contract by top label with top sales and promotion to all top radio , tv & internet channels. They need top fans to  and a top booking agency to get top tour and they need top finance control to get top income at low cost.
        </textarea>
    </div>
</template>
<script>
    import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

    export default {
        name: 'wysiwyg-editor',
        mounted(){
            const editorElement = this.$refs.editorElement;

            ClassicEditor
                .create(
                    editorElement
                )
                .then(editor => {
                    console.log(editor);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }
</script>