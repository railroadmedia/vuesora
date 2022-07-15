import ContentService from '../assets/js/services/content';
import Toasts from '../assets/js/classes/toasts';

export default {

    methods: {
        // Used at the top level to emit the event with a payload
        addToList() {
            if (this.destroyOnListRemoval) {
                Toasts.confirm({
                    title: 'Hold your horses… This will remove this lesson from your list, are you sure about this?',
                    submitButton: {
                        text: `<span class="bg-${this.themeColor} text-white short">I want to remove it</span>`,
                        callback: () => {
                            this.emitAddToList({
                                content_id: this.item.id,
                                is_added: this.item.is_added_to_primary_playlist || false,
                            });

                            Toasts.push({
                                icon: 'happy',
                                title: 'REMOVED!',
                                themeColor: this.themeColor,
                                message: 'The lesson has been removed from your list.',
                            });
                        },
                    },
                    cancelButton: {
                        text: '<span class="bg-grey-3 inverted text-grey-3 short">Get me out of here</span>',
                    },
                });
            } else {
                this.emitAddToList({
                    content_id: this.item.id,
                    is_added: this.item.is_added_to_primary_playlist || false,
                });
            }
        },

        progressReset(event) {
            const icon = event.target;

            Toasts.confirm({
                title: 'Hold your horses… This will reset your progress, are you sure about this?',
                submitButton: {
                    text: `<span class="bg-${this.themeColor} text-white short">I want to start over</span>`,
                    callback: () => {
                        icon.classList.remove('fa-undo');
                        icon.classList.add('fa-spin', 'fa-spinner');

                        this.emitResetProgress({
                            content_id: this.item.id,
                            icon,
                        });
                    },
                },
                cancelButton: {
                    text: '<span class="bg-grey-3 inverted text-grey-3 short">Get me out of here</span>',
                },
            });
        },

        // Used to bus the event up one more level to the components parent
        emitAddToList(payload) {
            this.$emit('addToList', payload);
        },

        emitResetProgress(payload) {
            this.$emit('progressReset', payload);
        },

        // Used to handle the event when bussed to the top level parent
        addToListEventHandler(payload) {
            if (this.branchPathContent &&
                this.branchPathContent.data && 
                this.branchPathContent.data.map(post => post.id).indexOf(payload.content_id) !== -1) {
                const post_index = this.branchPathContent.data.map(post => post.id).indexOf(payload.content_id);
                this.branchPathContent.data[post_index].is_added_to_primary_playlist =
                    !this.branchPathContent.data[post_index].is_added_to_primary_playlist;

                if (payload.is_added && this.destroyOnListRemoval) {
                    this.branchPathContent.data.splice(post_index, 1);
                }

                ContentService.addOrRemoveContentFromList(payload.content_id, payload.is_added)
                    .then((response) => {
                        if (!response) {
                            this.branchPathContent.data[post_index].is_added_to_primary_playlist =
                                !this.branchPathContent.data[post_index].is_added_to_primary_playlist;
                        }
                    });
            } else {
                const post_index = this.content.map(post => post.id).indexOf(payload.content_id);
                this.content[post_index].is_added_to_primary_playlist = !this.content[post_index].is_added_to_primary_playlist;

                if (payload.is_added && this.destroyOnListRemoval) {
                    this.content.splice(post_index, 1);
                }

                ContentService.addOrRemoveContentFromList(payload.content_id, payload.is_added)
                    .then((response) => {
                        if (!response) {
                            this.content[post_index].is_added_to_primary_playlist = !this.content[post_index].is_added_to_primary_playlist;
                        }
                    });
            }
        },

        resetProgressEventHandler(payload) {
            const post_index = this.content.map(post => post.id).indexOf(payload.content_id);

            ContentService.resetContentProgress(payload.content_id)
                .then((response) => {
                    if (response) {
                        Toasts.push({
                            icon: 'happy',
                            title: 'READY TO START AGAIN?',
                            themeColor: this.themeColor,
                            message: 'Your progress has been reset.',
                        });

                        this.content.splice(post_index, 1);
                    }


                    payload.icon.classList.remove('fa-spin', 'fa-spinner');
                    payload.icon.classList.add('fa-undo');
                });
        },

        addEvent(payload) {
            const payloadObject = payload.title ? payload : {
                title: this.mappedData.black_title,
                date: this.item.published_on,
            };

            this.$emit('addEvent', payloadObject);
        },
    },
};
