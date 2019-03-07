import DataMapper from './_default';

export default class StudentReviewDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card = {
            black_title: this.post['title'],
            description: this.post['description'],
            grey_title: this.getPostDuration()
        };

        this.list = {
            black_title: this.post['title'],
            description: this.post['description'],
            column_data: [
                this.getPostDate(),
            ]
        };

        this.schedule = {
            color_title: this.getType(),
            black_title: this.post['title'],
            column_data: [
                this.getPostInstructor(),
                DataMapper.mapDifficulty(this.post)
            ]
        };


        if(this.brand === 'pianote'){
            this.card.color_title = this.getTypeWithIcon();
        }
    }
}