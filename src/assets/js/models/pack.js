import ContentModel from './_default';

export default class PackModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.list.column_data = [
            this.postChildLessonCount,
            `${this.post.total_xp} xp`,
        ];
    }
}
