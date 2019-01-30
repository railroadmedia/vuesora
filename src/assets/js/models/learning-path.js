import DataMapper from './_default';

export default class LearningPathDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card = {
            black_title: this.post['title'],
            description: this.post['description'],
            grey_title: this.getDifficultyRange(),
        };

        this.list = {
            black_title: this.post['title'],
            description: this.post['description'],
            column_data: [
                this.getDifficultyRange()
            ]
        };

        this.schedule = {
            color_title: this.getType(),
            black_title: this.post['title'],
            column_data: [
                this.getPostInstructor(),
                this.getDifficultyRange()
            ]
        };
    }

    getDifficultyRange(){
        if(this.post['difficulty_range']){
            return 'Levels ' + this.post['difficulty_range'];
        }

        return 'TBD';
    }
}