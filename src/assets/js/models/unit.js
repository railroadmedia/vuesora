import DataMapper from './_default';

export default class UnitDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.color_title = this.postInstructor;

        this.list.color_title = this.postInstructor;
        this.list.column_data = [
            DataMapper.mapDifficulty(this.post),
            this.postChildLessonCount,
            this.postPublisedOn
        ];
    }
}