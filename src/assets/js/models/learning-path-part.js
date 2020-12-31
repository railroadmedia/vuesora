import ContentModel from './_default';

export default class LearningPathPartContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.card.description = this.getPostDatum('learning_path_description');
        this.card.color_title = this.postInstructor;
        this.card.grey_title = this.getPostDifficulty();

        this.list.color_title = null;
        this.list.description = this.getPostDatum('description');
        this.list.column_data = [
            this.getPostDuration(),
            `${this.post.total_xp} XP`,
        ];

        if (this.brand === 'guitareo' || this.brand === 'pianote') {
            this.list.description = this.getPostDatum('description');
            this.list.column_data = [
                this.postChildLessonCount,
            ];
        }
    }
}
