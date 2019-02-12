import DataMapper from './_default';

export default class UnitPartDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card = {
            color_title: this.getPostInstructor(),
            black_title: this.post['title'],
            description: this.post['description'],
            grey_title: DataMapper.mapDifficulty(this.post)
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

        if(this.brand === 'guitareo'){
            this.card.color_title = this.getTypeWithIcon();

            this.list.color_title = null;
            this.list.column_data = [
                this.getPostDuration()
            ];
        }
    }
}