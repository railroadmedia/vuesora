import ContentModel from './_default';

export default class PackBundleLessonContentModel extends ContentModel {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.grey_title = this.getPostDuration();

        this.list.color_title = null;
        this.list.column_data = [
            this.getPostDuration()
        ];
    }
}