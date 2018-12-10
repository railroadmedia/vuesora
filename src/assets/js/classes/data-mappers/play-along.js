import DataMapper from './_default';

export default class PlayAlongDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card = {
            color_title: this.post['style'] || 'TBD',
            black_title: this.post['title'],
            description: this.post['description'],
            grey_title: DataMapper.mapDifficulty(this.post)
        };

        this.list = {
            black_title: this.post['title'],
            description: this.post['description'],
            column_data: [
                this.post['style'] || 'TBD',
                this.post['bpm'] + ' BPM'
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