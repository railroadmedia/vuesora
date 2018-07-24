import moment from 'moment';

export default class DataMapper {
    /**
     *
     * @param {string} content_type
     * @param {string} card_type
     * @param {object} post
     * @returns {object} - A mutated object representing the post
     */
    constructor({content_type, card_type = 'card', post}){
        this.content_type = content_type;
        this.card_type = card_type;
        this.post = post;

        this.data_mappers = {

            'course': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.mapDifficulty(),
                        '9 Parts', // TODO: REPLACE ME WHEN DATA EXISTS
                        this.getPostDate()
                    ]
                }
            },

            'recording': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.mapDifficulty(),
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            'live': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.mapDifficulty(),
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            'gear-guides': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            'challenges': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.mapDifficulty(),
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            'bootcamps': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.mapDifficulty(),
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            'quick-tips': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.mapDifficulty(),
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            'podcasts': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            'on-the-road': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            'behind-the-scenes': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            'study-the-greats': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            'solos': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            'performances': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },


            'song': {
                card: {
                    color_title: this.post['artist'],
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.mapDifficulty(),
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            'play-along': {
                card: {
                    color_title: this.post['style'],
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.mapDifficulty(),
                        this.getPostDuration(),
                        this.post['bpm']
                    ]
                }
            },

            'rudiments': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            'student-focus': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            },

            default: {
                card: {
                    color_title: this.post['type'],
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                }
            }
        };

        if(this.data_mappers[this.content_type] != null){
            return this.data_mappers[this.content_type][this.card_type];
        }

        return this.data_mappers['default'][this.card_type];
    }

    getPostInstructor(){
        if(this.post['instructor']){
            if(Array.isArray(this.post['instructor'])){
                let instructors = [];

                this.post['instructor'].forEach(instructor => {
                    instructors.push(instructor['name']);
                });

                return instructors.join(', ');
            }
            else {
                return this.post['instructor']['name'];
            }
        }

        return 'N/A';
    }

    getPostDuration(){
        return this.post['video'] ?
            moment(this.post['video']['length_in_seconds'] * 1000).format('m') + ' mins' :
            'N/A'
    }

    getPostDate(){
        return moment(this.post['published_on']).format('MMM d/YY');
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