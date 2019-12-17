import ContentModel from './_default';

export default class LearningPathLevelContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.card.grey_title = this.postChildLessonCount;

        this.list.thumb_title = this.levelNumber;
        this.list.thumb_logo = this.getThumbLogo();
        this.list.color_title = this.postInstructor;
        this.list.column_data = [
            this.postChildLessonCount,
            `${this.getPostField('xp')} xp`,
        ];
        this.list.description = this.getPostDatum('description');
    }

    get levelNumber() {
        return `Level ${this.post.position}`;
    }

    getThumbLogo() {
        return 'https://dpwjbsxqtam5n.cloudfront.net/pack-logos/drumeo-method-logo.png';
    }
}
