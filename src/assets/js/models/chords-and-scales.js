import ContentModel from './_default';

export default class ChordsAndScalesContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.card.color_title = this.postType;
        this.card.grey_title = this.post.chord_or_scale;

        this.list.show_numbers = true;
        this.list.column_data = [
            this.getPostDuration(),
            this.postPublisedOn,
        ];

        if (brand === 'pianote') {
            this.card.color_title = '<i class="icon-chords" style="margin-right:5px;"></i> <span class="text-white">Chords And Scales</span>';

            this.list.sheet_music = this.getPostDatum('piano_keys_thumbnail_url');
            this.list.column_data = [];
        }
    }
}
