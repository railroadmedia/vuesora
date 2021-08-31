<template>
    <div class="flex flex-column">
        <input
            v-model="contentInterface"
            type="hidden"
            :name="fieldKey"
        >

        <tinymce-editor
            v-model="contentInterface"
            api-key="g84168rl7b45du7fji2nive374o541mhtmzogyolgqng97xc"
            :init="initObject"
            @input="handleInput"
        ></tinymce-editor>
    </div>
</template>
<script>
import Editor from '@tinymce/tinymce-vue';

export default {
    name: 'TextEditor',
    components: {
        'tinymce-editor': Editor,
    },
    model: {
        prop: 'contentInterface',
        event: 'input',
    },
    props: {
        height: {
            type: Number,
            default: () => 300,
        },
        toolbar: {
            type: String,
            default: () => 'bold italic underline | bullist numlist | link image media | forecolor backcolor | emoticons',
        },
        imageUploadEndpoint: {
            type: String,
            default: () => null,
        },
        initialValue: {
            default: () => null,
        },
        fieldKey: {
            type: String,
            default: () => 'content',
        },
    },
    data() {
        return {
            currentValue: this.initialValue,
        };
    },
    computed: {
        contentInterface: {
            get() {
                return this.currentValue;
            },
            set(val) {
                this.currentValue = val;
            },
        },

        initObject() {
            return {
                autoresize_min_height: this.height,
                branding: false,
                content_id: '#textEditor',
                content_style: `body { ${this.isDarkMode ? 'background-color:#444444; color:#fff;' : ''} font-family: sans-serif; font-size:16px; font-weight:400; } p { margin:0; } blockquote { margin: 0 0 0 1em !important; padding: 10px 30px !important; border-radius: 7px; border-left: 3px solid;} blockquote.pianote { border-color: #F61A30 !important; background-color: rgb(246 26 48 / 5%); } blockquote.drumeo { border-color: #0B76DB !important; background-color: rgb(11 118 219 / 5%); } blockquote.guitareo { border-color: #00C9AC !important; background-color: rgb(0 201 172 / 5%); } blockquote.singeo { border-color: #8300E9 !important; background-color: rgb(131 0 233 / 5%) } .quote-heading strong { font-size:13px; } .quote-heading em { font-size:10px; font-style:italic;text-transform:uppercase;color:#5e5e5e; } span.post-id { display:none; }`,
                convert_urls: false,
                default_link_target: '_blank',
                elementpath: false,
                entity_encoding: 'numeric',
                emoticons_database: 'emojiimages',
                file_picker_types: 'image',
                height: this.height,
                image_description: false,
                image_dimensions: false,
                images_upload_url: this.imageUploadEndpoint,
                link_assume_external_targets: true,
                link_title: false,
                menubar: false,
                media_poster: false,
                media_dimensions: false,
                media_alt_source: false,
                paste_as_text: true,
                plugins: 'lists link image media autolink autoresize imagetools paste textcolor colorpicker emoticons',
                relative_urls: false,
                resize: false,
                statusbar: false,
                target_list: false,
                toolbar: this.toolbar,
                setup: (editor) => {
                    editor.on('input', () => {
                        editor.save();
                    });
                },
            };
        },
        isDarkMode() {
            return document.body.classList.contains('dark-mode');
        },
    },
    methods: {
        handleInput() {
            this.$emit('input', {
                currentValue: this.currentValue,
            });
        },
    },
};
</script>

