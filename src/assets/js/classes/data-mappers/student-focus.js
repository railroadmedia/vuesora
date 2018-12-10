import DataMapper from './_default';

export default class StudentFocusDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card = {
            color_title: this.getPostInstructor(),
            black_title: this.post['title'],
            description: this.post['description'],
            grey_title: this.getPostDate()
        };

        this.list = {
            color_title: this.getPostInstructor(),
            black_title: this.post['title'],
            description: this.post['description'],
            column_data: [
                this.getPostDuration(),
                this.getPostDate()
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
    }
}