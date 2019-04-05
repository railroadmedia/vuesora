import DataMapper from './_default';

export default class SongPartDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.color_title = this.post['artist'];

        this.list.column_data = [
            this.getPostDuration(),
        ];

        if(this.brand === 'guitareo'){
            this.card.color_title = this.postType;

            this.list.color_title = null;
        }
    }
}