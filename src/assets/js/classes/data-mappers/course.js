import DataMapper from '../data-mapper';

export default class CourseDataMapper extends DataMapper {
    constructor({content_type, card_type = 'card', post}){
        super({
            content_type,
            card_type,
            post
        });
    }

    drumeo(){
        return {
            card: {
                color_title: this.getPostInstructor(),
                black_title: this.post['title'],
                description: this.post['description'],
                grey_title: DataMapper.mapDifficulty(this.post)
            },
            list: {
                color_title: this.getPostInstructor(),
                black_title: this.post['title'],
                description: this.post['description'],
                column_data: [
                    DataMapper.mapDifficulty(this.post),
                    this.getChildLessonCount(),
                    this.getPostDate()
                ]
            },
            schedule: {
                color_title: this.getType(),
                black_title: this.post['title'],
                column_data: [
                    this.getPostInstructor(),
                    DataMapper.mapDifficulty(this.post)
                ]
            }
        }
    }

    guitareo(){
        return {
            card: {
                color_title: this.getPostInstructor(),
                black_title: this.post['title'],
                description: this.post['description'],
                grey_title: DataMapper.mapDifficulty(this.post)
            },
            list: {
                color_title: this.getPostInstructor(),
                black_title: this.post['title'],
                description: this.post['description'],
                column_data: [
                    DataMapper.mapDifficulty(this.post),
                    this.getChildLessonCount(),
                    this.getPostDate()
                ]
            },
            schedule: {
                color_title: this.getType(),
                black_title: this.post['title'],
                column_data: [
                    this.getPostInstructor(),
                    DataMapper.mapDifficulty(this.post)
                ]
            }
        }
    }
}