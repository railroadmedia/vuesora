import DataMapper from './_default';

export default class LearningPathDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.grey_title = this.getPostField('difficulty_range');

        this.list.color_title = null;
        this.list.column_data = [
            this.getPostField('difficulty_range')
        ];
    }
}