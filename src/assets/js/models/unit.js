import ContentModel from './_default';

export default class UnitContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.card.color_title = this.postInstructor;

        this.list.thumb_title = this.levelNumber;
        this.list.thumb_logo = this.getThumbLogo();
        this.list.color_title = null;
        this.list.grey_title = `with ${this.parseInstructors()}`;
        this.list.column_data = [
            ContentModel.mapDifficulty(this.post),
            this.postChildLessonCount,
            this.postPublisedOn,
        ];
    }

    get levelNumber() {
        return `Level ${this.post.position}`;
    }

    getThumbLogo() {
        return 'https://d2vyvo0tyx8ig5.cloudfront.net/books/foundations/foundations-logo-white.png';
    }
}
