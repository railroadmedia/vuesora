import ContentModel from './_default';

export default class PackBundleModel extends ContentModel {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.show_description = true;
        this.card.color_title = null;
        this.card.grey_title = this.postChildLessonCount;

        this.list.column_data = [
            this.postChildLessonCount
        ];
    }
}