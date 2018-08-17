import Requests from '../assets/js/classes/requests';
import Toasts from '../assets/js/classes/toasts';
import Noty from "noty";

export default {

    methods: {
        // Used at the top level to emit the event with a payload
        addToList(){
            this.emitAddToList({
                content_id: this.$_item.id,
                is_added: this.$_item.is_added_to_primary_playlist || false
            });
        },

        resetProgress(){
            const notification = new Noty({
                layout: 'center',
                modal: true,
                text: 'Do you really want to reset your progress? <br><br><span class="tiny text-grey-3 font-italic">This cannot be undone.</span>',
                theme: 'bootstrap-v4',
                closeWith: [],
                buttons: [
                    // Confirm Button
                    Noty.button('<span class="bg-success text-white short">YES</span>', 'btn mr-1', () => {

                        notification.close();

                        this.emitResetProgress({
                            content_id: this.$_item.id
                        })
                    }),
                    // Cancel Button
                    Noty.button('<span class="bg-dark inverted text-grey-3 short">NO</span>', 'btn', () => {
                        notification.close();
                    })
                ]
            }).show();

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
                        Toasts.success('Progress has been reset.');
                        this.content.splice(post_index, 1);
                    }
                });
        }
    }
}