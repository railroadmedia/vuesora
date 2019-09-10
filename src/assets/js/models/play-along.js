import ContentModel from './_default';

export default class PlayAlongContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.card.color_title = this.getPostField('style');

        this.list.column_data = [
            ContentModel.mapDifficulty(this.post),
            this.getPostField('style'),
            `${this.getPostField('bpm')} BPM`,
        ];

        if (this.brand === 'guitareo') {
            this.card.color_title = this.getTypeWithIcon();
            this.card.grey_title = `${this.postInstructor}, ${ContentModel.mapDifficulty(this.post)}`;

            this.list.color_title = null;
            this.list.column_data = [
                this.postInstructor,
                ContentModel.mapDifficulty(this.post),
                this.postChildLessonCount,
                this.postPublisedOn,
            ];
        }
    }
}
