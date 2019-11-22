import ContentModel from './_default';

export default class UnitContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.card.color_title = this.postInstructor;

        this.list.thumb_title = this.levelNumber;
        this.list.color_title = this.postInstructor;
        this.list.column_data = [
            ContentModel.mapDifficulty(this.post),
            this.postChildLessonCount,
            this.postPublisedOn,
        ];
    }

    get levelNumber() {
        return `Level ${this.post.position}`;
    }
}
