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
        this.list.color_title = null;
        this.list.grey_title = `with ${this.parseInstructors()}`;
        this.list.column_data = [
            this.postChildLessonCount,
            `${this.getPostField('xp')} xp`,
        ];
        this.list.description = this.getPostDatum('description');
    }

    get postChildLessonCount() {
        return this.post.lesson_count ? `${this.post.lesson_count} Courses` : 'TBD';
    }

    get levelNumber() {
        return `Level ${this.post.position}`;
    }

    getThumbLogo() {
        return 'https://dpwjbsxqtam5n.cloudfront.net/pack-logos/drumeo-method-logo.png';
    }

    parseInstructors() {
        const instructors = this.getInstructors();

        console.log(instructors);

        return instructors ? instructors.replace(/,(?=[^,]*$)/, ' &') : 'TBD';
    }
}
