import ContentModel from './_default';

export default class RecordingContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.card.color_title = this.postInstructor;

        this.list.color_title = this.postInstructor;
        this.list.column_data = [
            ContentModel.mapDifficulty(this.post),
            this.getPostDuration(),
            this.postPublisedOn,
        ];

        if (this.brand === 'guitareo') {
            this.card.color_title = this.getTypeWithIcon();
        }
    }
}
