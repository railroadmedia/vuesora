import ContentModel from './_default';

export default class PlayAlongPartContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.list.column_data = [
            this.getPostDuration(),
        ];
    }
}
