import DataMapper from './_default';

export default class ShowDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.color_title = this.postInstructor;

        this.list.column_data = [
            DataMapper.mapDifficulty(this.post),
            this.getPostDuration(),
            this.postPublisedOn
        ];

        if(this.brand === 'pianote'){
            this.card.color_title = this.getTypeWithIcon();
        }

        if(this.brand === 'guitareo'){
            this.card.color_title = this.getTypeWithIcon().replace(/recording/, 'archives');
        }
    }
}