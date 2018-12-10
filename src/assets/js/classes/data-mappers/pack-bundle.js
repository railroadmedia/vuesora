import DataMapper from './_default';

export default class PackBundleDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });


        this.card = {
            show_description: true,
            black_title: this.post['title'],
            description: this.post['description'],
            grey_title: this.getChildLessonCount()
        };

        this.list = {
            black_title: this.post['title'],
            description: this.post['description'],
            column_data: [
                this.getChildLessonCount()
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