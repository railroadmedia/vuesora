import ContentModel from './_default';

export default class QnaContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.card.grey_title = this.getPostDuration();

        this.list.column_data = [
            this.getPostDuration(),
        ];

        if (this.brand === 'pianote') {
            this.card.color_title = this.getTypeWithIcon();
        }
    }
}
