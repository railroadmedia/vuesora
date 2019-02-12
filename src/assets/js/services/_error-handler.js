import Toasts from "../classes/toasts";

export default function(error){
    console.error(error);
    Toasts.push({
        icon: 'doh',
        title: 'An error happened on the server...',
        themeColor: 'error',
        message: 'Refresh the page to try once more, if it happens again please let us know using the chat below. ' +
            '<br><br><span class="font-italic text-grey-3">' +
            'Reference: <span class="font-bold">' + error.response.status + ' - ' + error.response.statusText +
            '</span></span>'
    });
}