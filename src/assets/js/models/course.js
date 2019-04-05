import DataMapper from './_default';

export default class CourseDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.color_title = this.postInstructor;

        this.list.column_data = [
            DataMapper.mapDifficulty(this.post),
            this.postChildLessonCount,
            this.postPublisedOn
        ];

        if(this.brand === 'guitareo'){
            this.card.color_title = this.getTypeWithIcon();
            this.card.grey_title = this.postInstructor() + ', ' + DataMapper.mapDifficulty(this.post);

            this.list.color_title = null;
            this.list.column_data = [
                this.postInstructor(),
                DataMapper.mapDifficulty(this.post),
                this.postChildLessonCount,
                this.postPublisedOn
            ]
        }

        if(this.brand === 'pianote'){
            this.card.color_title = this.getTypeWithIcon();
        }
    }
}