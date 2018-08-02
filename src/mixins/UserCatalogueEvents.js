import Requests from '../assets/js/classes/requests';
import Toasts from '../assets/js/classes/toasts';

export default {

    methods: {
        // Used at the top level to emit the event with a payload
        addToList(){
            this.emitAddToList({
                content_id: this.$_item.id,
                is_added: this.$_item.is_added_to_primary_playlist || false
            });
        },

        // Used to bus the event up one more level to the components parent
        emitAddToList(payload){
            this.$emit('addToList', payload);
        },

        // Used to handle the event when bussed to the top level parent
        addToListEventHandler(payload){
            const post_index = this.content.map(post => post.id).indexOf(payload.content_id);

            this.content[post_index].is_added_to_primary_playlist = !this.content[post_index].is_added_to_primary_playlist;

            if(payload.is_added && this.$_destroy_on_list_removal){
                this.content.splice(post_index, 1);
            }

            Requests.addOrRemoveContentFromList(payload.content_id, payload.is_added)
                .then(response => {
                    if(!response){
                        this.content[post_index].is_added_to_primary_playlist = !this.content[post_index].is_added_to_primary_playlist;
                    }
                });
        }
    }
}