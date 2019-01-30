import DataMapper from './_default';

export default class ChordsAndScalesDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card = {
            color_title: this.getType(),
            black_title: this.post['title'],
            description: this.post['description'],
            grey_title: this.post['chord_or_scale']
        };

        this.list = {
            show_numbers: true,
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