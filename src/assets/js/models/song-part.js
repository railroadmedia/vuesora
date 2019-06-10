import ContentModel from './_default';

export default class SongPartModel extends ContentModel {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.color_title = this.getPostField('artist');

        this.list.column_data = [
            this.getPostDuration(),
        ];

        if(this.brand === 'guitareo' || this.brand === 'pianote'){
            this.card.color_title = this.getTypeWithIcon;

            this.list.color_title = null;
        }
    }
}