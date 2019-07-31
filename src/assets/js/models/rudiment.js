import ContentModel from './_default';

export default class RudimentContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.card.sheet_music = this.getPostDatum('sheet_music_thumbnail_url');

        this.list.color_title = null;
        this.list.sheet_music = this.getPostDatum('sheet_music_thumbnail_url');
        this.list.column_data = [];
    }
}
