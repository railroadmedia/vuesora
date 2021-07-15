import ContentModel from './_default';

export default class RoutineContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {

        super({
            brand,
            post,
        });

        this.low_soundslice_slug = this.getPostField('low_soundslice_slug');
        this.high_soundslice_slug = this.getPostField('high_soundslice_slug');
        this.title = this.getPostField('title');
    }
}
