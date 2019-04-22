import DataMapper from './_default';

export default class SongPartDataMapper extends DataMapper {
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