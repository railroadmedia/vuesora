import Noty from 'noty';
import Toasts from 'vuesora/src/assets/js/classes/toasts';
import axios from 'axios';

export default (function(){
    const clearAvatar = document.getElementById('clearAvatar');
    const clearGearPhoto = document.getElementById('clearGearPhoto');

    const vuePropData = document.getElementById('vuePropData');
    const saveEndpoint = vuePropData.dataset['saveEndpoint'];
    const fieldKey = vuePropData.dataset['fieldKey'];

    if(clearAvatar){
        clearAvatar.addEventListener('click', event => {
            const notification = new Noty({
                layout: 'center',
                modal: true,
                text: 'Do you really want to reset your avatar? <br><br><span class="tiny text-grey-3 font-italic">This cannot be undone.</span>',
                theme: 'bootstrap-v4',
                closeWith: [],
                buttons: [
                    // Confirm Button
                    Noty.button('<span class="bg-success text-white short">YES</span>', 'btn mr-1', () => {

                        notification.close();
                        axios.patch(saveEndpoint, {
                            data: {
                                attributes: {
                                    'profile_picture_url': ''
                                }
                            }
                        })
                            .then(response => {
                                if(response.data){
                                    Toasts.success('Avatar successfuly reset! Refreshing the page..');
                                    location.reload();
                                }
                            })
                            .catch(error => {
                                console.error(error);
                                Toasts.errorWarning();
                            });
                    }),
                    // Cancel Button
                    Noty.button('<span class="bg-dark inverted text-grey-3 short">NO</span>', 'btn', () => {
                        notification.close();
                    })
                ]
            }).show();
        });
    }

    // if(clearGearPhoto){
    //     clearGearPhoto.addEventListener('click', event => {
    //         const notification = new Noty({
    //             layout: 'center',
    //             modal: true,
    //             text: 'Do you really want to reset your gear photo? <br><br><span class="tiny text-grey-3 font-italic">This cannot be undone.</span>',
    //             theme: 'bootstrap-v4',
    //             closeWith: [],
    //             buttons: [
    //                 // Confirm Button
    //                 Noty.button('<span class="bg-success text-white short">YES</span>', 'btn mr-1', () => {
    //
    //                     notification.close();
    //                     axios.patch('/laravel/public/user', {
    //                         key: 'drumkit-image|user-profile-images',
    //                         value: '',
    //                         '_method': 'PATCH'
    //                     })
    //                         .then(response => {
    //                             if(response.data){
    //                                 Toasts.success('Gear photo successfuly reset! Refreshing the page..');
    //                                 // location.reload();
    //                             }
    //                         })
    //                         .catch(error => {
    //                             console.error(error);
    //                             Toasts.errorWarning();
    //                         });
    //                 }),
    //                 // Cancel Button
    //                 Noty.button('<span class="bg-dark inverted text-grey-3 short">NO</span>', 'btn', () => {
    //                     notification.close();
    //                 })
    //             ]
    //         }).show();
    //     });
    // }
})();