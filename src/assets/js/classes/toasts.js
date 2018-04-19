import Noty from 'noty';

export default class Toasts {

    static success(text){
        return new Noty({
            type: 'success',
            theme: 'bootstrap-v4',
            text: text,
            timeout: 5000,
            layout: 'topRight'
        }).show();
    }

    static errorWarning(text){
        return new Noty({
            type: 'warning',
            theme: 'bootstrap-v4',
            text: text + '<br><br><span class="tiny font-italic">If the problem persists, please <a href="mailto:support@recordeo.com" target="_blank">contact support.</a></span>',
            timeout: 5000,
            layout: 'topRight'
        }).show();
    }
}