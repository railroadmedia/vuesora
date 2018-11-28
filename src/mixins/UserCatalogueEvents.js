import Requests from '../assets/js/classes/requests';
import Toasts from '../assets/js/classes/toasts';
import Noty from "noty";

export default {

    methods: {
        // Used at the top level to emit the event with a payload
        addToList(){
            if(this.$_destroyOnListRemoval){

                Toasts.confirm({
                    title: 'Hold your horses… This will remove this lesson from your list, are you sure about this?',
                    submitButton: {
                        text: '<span class="bg-drumeo text-white">I want to remove it</span>',
                        callback: () => {

                            this.emitAddToList({
                                content_id: this.$_item.id,
                                is_added: this.$_item.is_added_to_primary_playlist || false
                            });

                            Toasts.push({
                                icon: 'happy',
                                title: 'Ready to start again?',
                                message: 'Item removed from list.'
                            });
                        }
                    },
                    cancelButton: {
                        text: '<span class="bg-grey-3 inverted text-grey-3">Get me out of here</span>'
                    }
                });
            }
            else {
                this.emitAddToList({
                    content_id: this.$_item.id,
                    is_added: this.$_item.is_added_to_primary_playlist || false
                });
            }
        },

        resetProgress(event){
            const icon = event.target;

            Toasts.confirm({
                title: 'Hold your horses… This will reset your progress, are you sure about this?',
                submitButton: {
                    text: '<span class="bg-drumeo text-white">I want to start over</span>',
                    callback: () => {

                        icon.classList.remove('fa-undo');
                        icon.classList.add('fa-spin', 'fa-spinner');

                        this.emitResetProgress({
                            content_id: this.$_item.id,
                            icon: icon
                        });
                    }
                },
                cancelButton: {
                    text: '<span class="bg-grey-3 inverted text-grey-3">Get me out of here</span>'
                }
            });
        },

        // Used to bus the event up one more level to the components parent
        emitAddToList(payload){
            this.$emit('addToList', payload);
        },

        emitResetProgress(payload){
            this.$emit('resetProgress', payload);
        },

        // Used to handle the event when bussed to the top level parent
        addToListEventHandler(payload){
            const post_index = this.content.map(post => post.id).indexOf(payload.content_id);

            this.content[post_index].is_added_to_primary_playlist = !this.content[post_index].is_added_to_primary_playlist;

            if(payload.is_added && this.$_destroyOnListRemoval){
                this.content.splice(post_index, 1);
            }

            Requests.addOrRemoveContentFromList(payload.content_id, payload.is_added)
                .then(response => {
                    if(!response){
                        this.content[post_index].is_added_to_primary_playlist = !this.content[post_index].is_added_to_primary_playlist;
                    }
                });
        },

        resetProgressEventHandler(payload){
            const post_index = this.content.map(post => post.id).indexOf(payload.content_id);

            Requests.resetContentProgress(payload.content_id)
                .then(response => {
                    if(response){
                        Toasts.push({
                            icon: 'happy',
                            title: 'READY TO START AGAIN?',
                            message: 'Your progress has been reset.'
                        });

                        this.content.splice(post_index, 1);
                    }


                    payload.icon.classList.remove('fa-spin', 'fa-spinner');
                    payload.icon.classList.add('fa-undo');
                });
        },

        addEvent(payload){
            const payloadObject = payload.title ? payload : {
                title: this.$_item.title,
                date: this.$_item.published_on
            };

            this.$emit('addEvent', payloadObject);
        }
    }
}