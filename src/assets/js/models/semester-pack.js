import DataMapper from './_default';

export default class SemesterPackDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.show_description = true;
        this.card.grey_title = this.postChildLessonCount;

        this.list.column_data = [
            this.postChildLessonCount
        ]
    }
}