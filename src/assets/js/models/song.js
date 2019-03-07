import DataMapper from './_default';

export default class SongDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card = {
            color_title: this.post['artist'],
            black_title: this.post['title'],
            description: this.post['description'],
            grey_title: DataMapper.mapDifficulty(this.post)
        };

        this.list = {
            color_title: this.post['artist'] || 'TBD',
            black_title: this.post['title'],
            description: this.post['description'],
            column_data: [
                DataMapper.mapDifficulty(this.post),
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

        if(this.brand === 'guitareo'){
            this.card.color_title = this.getTypeWithIcon();
            this.card.grey_title = this.getPostInstructor() + ', ' + DataMapper.mapDifficulty(this.post);

            this.list.color_title = null;
            this.list.column_data = [
                DataMapper.mapDifficulty(this.post),
                this.getStyle(),
                this.getChildLessonCount(),
                this.getPostDate()
            ]
        }

        if(this.brand === 'pianote'){
            this.card.color_title = this.getTypeWithIcon();

            this.list.column_data = [
                this.getStyle(),
                DataMapper.mapDifficulty(this.post),
                // this.getChildLessonCount(),
                this.getPostDate()
            ]
        }
    }
}