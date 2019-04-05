import DataMapper from './_default';

export default class StudentFocusDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.color_title = this.postInstructor;
        this.card.grey_title = this.postPublisedOn;

        this.list.color_title = this.postInstructor;
        this.list.column_data = [
            this.getPostDuration(),
            this.postPublisedOn,
        ];
    }
}