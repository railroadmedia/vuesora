import ContentModel from './_default';

export default class UnitPartContentModel extends ContentModel {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.color_title = this.postInstructor;

        this.list.show_numbers = true;
        this.list.color_title = null;
    }
}