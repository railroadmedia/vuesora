import ContentModel from './_default';

export default class UnitModel extends ContentModel {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.color_title = this.postInstructor;

        this.list.color_title = this.postInstructor;
        this.list.column_data = [
            ContentModel.mapDifficulty(this.post),
            this.postChildLessonCount,
            this.postPublisedOn
        ];
    }
}