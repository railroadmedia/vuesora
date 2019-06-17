import ContentModel from './_default';

export default class SemesterPackContentModel extends ContentModel {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.show_description = true;
        this.card.grey_title = this.postChildLessonCount;

        this.list.column_data = [
            this.postChildLessonCount
        ]
    }
}