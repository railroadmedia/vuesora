import DataMapper from './_default';

export default class RudimentDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card = {
            black_title: this.post['title'],
            description: this.post['description'],
            sheet_music: this.post['sheet_music_thumbnail_url']
        };

        this.list = {
            black_title: this.post['title'],
            sheet_music: this.post['sheet_music_thumbnail_url'],
            description: this.post['description'],
            column_data: []
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