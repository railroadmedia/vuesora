import ContentModel from './_default';

export default class SongPdfContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.title = this.getPostField('title');
        this.artist = this.getPostField('artist');
        this.pdf = this.getPostField('pdf');
        this.pdf_in_g = this.getPostField('pdf_in_g');
    }
}
