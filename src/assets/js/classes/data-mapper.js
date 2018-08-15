import moment from 'moment';

export default class DataMapper {
    /**
     * Take a content post and map specific post data to specific keys based on content type
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
                        this.post['lesson_count'] + ' Parts',
                        this.getPostDate()
                    ]
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
                    ]
                }
            },

            'course-part': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    show_numbers: true,
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
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
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
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
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
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
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
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
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
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
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
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
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
                    ]
                }
            },

            'podcasts': {
                card: {
                    color_title: this.getEpisodeNumber(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getEpisodeNumber(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
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
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
                    ]
                }
            },

            'behind-the-scenes': {
                card: {
                    color_title: this.getEpisodeNumber(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getEpisodeNumber(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
                    ]
                }
            },

            'study-the-greats': {
                card: {
                    color_title: this.getEpisodeNumber(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty()
                },
                list: {
                    color_title: this.getEpisodeNumber(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
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
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
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
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
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
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
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
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.post['style'],
                        this.post['bpm'] + ' BPM'
                    ]
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
                    ]
                }
            },

            'rudiment': {
                card: {
                    black_title: this.post['title'],
                    description: this.post['description'],
                    sheet_music: this.post['sheet_music_thumbnail_url']
                },
                list: {
                    black_title: this.post['title'],
                    sheet_music: this.post['sheet_music_thumbnail_url'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration()
                    ]
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
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
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
                    ]
                }
            },

            'learning-path': {
                card: {
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.mapDifficulty(),
                },
                list: {
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.mapDifficulty()
                    ]
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
                    ]
                }
            },

            'pack-bundle': {
                card: {
                    show_description: true,
                    black_title: 'DVD ' + this.post['position'] + ' - ' + this.post['title'],
                    description: this.post['description'],
                    grey_title: this.post['lesson_count'] + ' Lessons'
                },
                list: {
                    black_title: 'DVD ' + this.post['position'] + ' - ' + this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.post['lesson_count'] + ' Lessons'
                    ]
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
                    ]
                }
            },

            'pack-bundle-lesson': {
                card: {
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.post['lesson_count'] + ' Lessons'
                },
                list: {
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration()
                    ]
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
                    ]
                }
            },

            'learning-path-part': {
                card: {
                    black_title: this.post['title'],
                    description: this.post['learning_path_description'],
                    grey_title: this.getPostDuration()
                },
                list: {
                    black_title: this.post['title'],
                    description: this.post['learning_path_description'],
                    column_data: [
                        this.getPostDuration(),
                        this.getPostDate()
                    ]
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
                    ]
                }
            },

            default: {
                card: {
                    color_title: this.getType(),
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
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        this.mapDifficulty()
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

    getType(){
        return this.post['type'].replace(/-/g, ' ');
    }

    getEpisodeNumber(){
        return 'Episode #' + this.post['sort'];
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

        // Some content has difficulty already parsed as a word, if its undefined,
        // Just default it to 'all'
        return this.post['difficulty'] || 'all';
    }
}