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
                    grey_title: DataMapper.mapDifficulty(this.post)
                },
                list: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        DataMapper.mapDifficulty(this.post),
                        this.post['lesson_count'] + ' Videos',
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
            },

            'course-part': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: DataMapper.mapDifficulty(this.post)
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
                        DataMapper.mapDifficulty(this.post)
                    ]
                }
            },

            'recording': {
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
                        this.getPostDuration(),
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
            },

            'live': {
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
                        this.getPostDuration(),
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
            },

            'gear-guides': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.getPostDate()
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
                        DataMapper.mapDifficulty(this.post)
                    ]
                }
            },

            'challenges': {
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
                        this.getPostDuration(),
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
            },

            'bootcamps': {
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
                        this.getPostDuration(),
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
            },

            'quick-tips': {
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
                        this.getPostDuration(),
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
            },

            'podcasts': {
                card: {
                    color_title: this.getEpisodeNumber(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.getPostDate()
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
                        DataMapper.mapDifficulty(this.post)
                    ]
                }
            },

            'on-the-road': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.getPostDate()
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
                        DataMapper.mapDifficulty(this.post)
                    ]
                }
            },

            'behind-the-scenes': {
                card: {
                    color_title: this.getEpisodeNumber(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.getPostDate()
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
                        DataMapper.mapDifficulty(this.post)
                    ]
                }
            },

            'study-the-greats': {
                card: {
                    color_title: this.getEpisodeNumber(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.getPostDate()
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
                        DataMapper.mapDifficulty(this.post)
                    ]
                }
            },

            'solos': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.getPostDate()
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
                        DataMapper.mapDifficulty(this.post)
                    ]
                }
            },

            'performances': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.getPostDate()
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
                        DataMapper.mapDifficulty(this.post)
                    ]
                }
            },

            'exploring-beats': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.getPostDate()
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
                        DataMapper.mapDifficulty(this.post)
                    ]
                }
            },


            'song': {
                card: {
                    color_title: this.post['artist'],
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: DataMapper.mapDifficulty(this.post)
                },
                list: {
                    color_title: this.post['artist'],
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        DataMapper.mapDifficulty(this.post),
                        this.getPostDuration(),
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
            },

            'play-along': {
                card: {
                    color_title: this.post['style'],
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: DataMapper.mapDifficulty(this.post)
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
                        DataMapper.mapDifficulty(this.post)
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
                    column_data: []
                },
                schedule: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    column_data: [
                        this.getPostInstructor(),
                        DataMapper.mapDifficulty(this.post)
                    ]
                }
            },

            'student-focus': {
                card: {
                    color_title: this.getPostInstructor(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.getPostDate()
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
                        DataMapper.mapDifficulty(this.post)
                    ]
                }
            },

            'learning-path': {
                card: {
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: DataMapper.mapDifficulty(this.post),
                },
                list: {
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        DataMapper.mapDifficulty(this.post)
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
            },

            'pack-bundle': {
                card: {
                    show_description: true,
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.post['lesson_count'] + ' Lessons'
                },
                list: {
                    black_title: this.post['title'],
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
                        DataMapper.mapDifficulty(this.post)
                    ]
                }
            },

            'pack-bundle-lesson': {
                card: {
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.getPostDuration()
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
                        DataMapper.mapDifficulty(this.post)
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
                    description: this.post['learning_path_description'] || this.post['description'],
                    column_data: [
                        this.getChildLessonCount(),
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
            },

            'student-review': {
                card: {
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.getPostDuration()
                },
                list: {
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDate(),
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
            },

            'question-and-answer': {
                card: {
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: this.getPostDuration()
                },
                list: {
                    black_title: this.post['title'],
                    description: this.post['description'],
                    column_data: [
                        this.getPostDuration(),
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
            },

            default: {
                card: {
                    color_title: this.getType(),
                    black_title: this.post['title'],
                    description: this.post['description'],
                    grey_title: DataMapper.mapDifficulty(this.post)
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
                        DataMapper.mapDifficulty(this.post)
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
            Math.round(
                moment.duration((this.post['video']['length_in_seconds'] * 1000), 'ms').asMinutes()
            ) + ' mins' :
            'N/A'
    }

    getPostDate(){
        return moment(this.post['published_on']).format('MMM D/YY');
    }

    getType(){
        return this.post['type'].replace('bundle-', '').replace(/-/g, ' ');
    }

    getEpisodeNumber(){
        return 'Episode #' + this.post['sort'];
    }

    getChildLessonCount(){
        return this.post['lesson_count'] + ' Lessons';
    }

    static mapDifficulty(post){
        if(post['difficulty'] <= 3){
            return 'beginner ' + post['difficulty']
        }
        else if(post['difficulty'] > 3 && post['difficulty'] <= 6){
            return 'intermediate ' + post['difficulty']
        }
        else if(post['difficulty'] > 6){
            return 'advanced ' + post['difficulty']
        }

        // Some content has difficulty already parsed as a word, if its undefined,
        // Just default it to 'all'
        return post['difficulty'] || 'all';
    }
}