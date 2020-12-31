import ContentModel from './_default';

export default class LearningPathCourseContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.card.grey_title = this.postChildLessonCount;

        this.list.color_title = null;
        this.list.column_data = [
            this.postChildLessonCount,
            `${this.post.total_xp} xp`,
        ];
        this.list.description = this.getPostDatum('description');
    }
}
