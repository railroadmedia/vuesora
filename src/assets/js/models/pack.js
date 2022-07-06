import ContentModel from './_default';

export default class PackModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        // this is only for pianote classical method pack which is show in the list view on pianote
        this.list.column_data = [
            `${this.post.lesson_count} COURSES`,
            `${this.post.total_xp} xp`,
        ];
    }
}
