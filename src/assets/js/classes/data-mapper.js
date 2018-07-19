export default class DataMapper {
    constructor({content_type, card_type = 'card', post}){
        this.content_type = content_type;
        this.card_type = card_type;
        this.post = post;

        this.data_mappers = {
            // COURSES
            'course': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    grey_title: this.mapDifficulty()
                }
            },

            // SONGS
            'song': {
                card: {
                    color_title: this.post['artist'],
                    black_title: this.post['title'],
                    grey_title: this.mapDifficulty()
                }
            },

            // PLAY ALONGS
            'play-along': {
                card: {
                    color_title: this.post['style'],
                    black_title: this.post['title'],
                    grey_title: this.mapDifficulty()
                }
            },

            // STUDENT FOCUS
            'student-focus': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    grey_title: this.mapDifficulty()
                }
            },

            // DEFAULT IF FOR WHATEVER REASON THE TYPE DOESNT EXIST
            default: {
                card: {
                    color_title: this.post['type'],
                    black_title: this.post['title'],
                    grey_title: this.mapDifficulty()
                }
            }
        };

        if(this.data_mappers[this.content_type] != null){
            return this.data_mappers[this.content_type][this.card_type];
        }

        return this.data_mappers['default'][this.card_type];
    }

    getPostInstructor(){
        return this.post['instructor'] ? this.post['instructor']['name'] : 'No Instructor'
    }

    mapDifficulty(){
        if(this.post['difficulty'] <= 3){
            return 'beginner'
        }
        else if(this.post['difficulty'] > 3 && this.post['difficulty'] <= 6){
            return 'intermediate'
        }
        else if(this.post['difficulty'] > 6){
            return 'advanced'
        }

        return 'all'
    }
}