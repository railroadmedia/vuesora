import { DateTime, Duration } from 'luxon';
import { Content as ContentHelpers } from 'js-helper-functions';

export default class ContentModel {
    constructor({ brand = 'drumeo', post }) {
        this.brand = brand;
        this.post = post;

        this.card = {
            thumbnail: this.getPostThumbnail(),
            color_title: this.postType,
            black_title: this.getPostField('title'),
            description: this.getPostDatum('description'),
            sheet_music: null,
            grey_title: ContentModel.mapDifficulty(this.post),
        };

        this.list = {
            thumbnail: this.getPostThumbnail(),
            color_title: this.postInstructor,
            black_title: this.getPostField('title'),
            description: this.getPostDatum('description'),
            sheet_music: null,
            column_data: [
                this.getPostDuration(),
                this.postPublisedOn,
            ],
        };

        this.schedule = {
            thumbnail: this.getPostThumbnail(),
            color_title: this.postType,
            black_title: this.getPostField('title'),
            column_data: [
                this.postInstructor,
                ContentModel.mapDifficulty(post),
            ],
        };
    }

    getPostField(key) {
        const postField = this.post.fields.find(field => field.key === key);

        return postField ? postField.value : 'TBD';
    }

    getPostDatum(key) {
        const datum = this.post.data.find(data => data.key === key);

        return datum ? datum.value : 'TBD';
    }

    get postInstructor() {
        const instructor = this.getPostField('instructor');

        if (typeof instructor === 'object' && instructor != null) {
            return instructor.fields.find(field => field.key === 'name').value;
        }

        return 'TBD';
    }

    getPostDuration() {
        const video = this.post.fields.find(field => field.key === 'video');

        if (video) {
            let duration = 0;
            const videoLength = video.value.fields.find(field => field.key === 'length_in_seconds');

            if (videoLength) {
                duration = videoLength.value;
            }

            const parsedDuration = Math.round(Duration.fromMillis((duration * 1000)).as('minutes'));

            return `${parsedDuration} mins`;
        }

        return 'TBD';
    }

    get postPublisedOn() {
        return DateTime.fromSQL(this.post.published_on).toFormat('LLL d/yy');
    }

    get postType() {
        return this.post.type.replace('bundle-', '').replace(/-/g, ' ');
    }

    getTypeWithIcon() {
        const icon = ContentHelpers.getContentTypeIcon(this.post.type);
        const type = this.postType;

        return `<i class="${icon}" style="margin-right:5px;"></i> <span class="text-white">${type}</span>`;
    }

    get episodeNumber() {
        return this.post.sort ? `Episode # ${this.post.sort}` : 'TBD';
    }

    get postChildLessonCount() {
        return this.post.lesson_count ? `${this.post.lesson_count} Lessons` : 'TBD';
    }

    getPostThumbnail() {
        const defaults = {
            drumeo: 'https://dmmior4id2ysr.cloudfront.net/assets/images/drumeo_fallback_thumb.jpg',
            pianote: 'https://dmmior4id2ysr.cloudfront.net/assets/images/pianote_fallback_thumb.jpg',
            guitareo: 'https://dmmior4id2ysr.cloudfront.net/assets/images/guitareo_fallback_thumb.jpg',
        };
        let thumb = this.getPostDatum('thumbnail_url');

        if (this.postType === 'learning-path' && this.brand === 'drumeo') {
            thumb = this.getPostDatum('background_image_url');
        }

        if (this.postType === 'chord and scale' && this.brand === 'guitareo') {
            thumb = this.getPostDatum('guitar_chord_image_url');
        }

        return thumb !== 'TBD' ? thumb : defaults[this.brand];
    }

    static mapDifficulty(post) {
        const difficultyField = post.fields.find(field => field.key === 'difficulty');
        const difficulty = difficultyField ? difficultyField.value : null;

        if (difficulty <= 3) {
            return `beginner ${difficulty}`;
        }
        if (difficulty > 3 && difficulty <= 6) {
            return `intermediate ${difficulty}`;
        }
        if (difficulty > 6) {
            return `advanced ${difficulty}`;
        }
        // Some content has difficulty already parsed as a word so we return that,
        // if its falsey, just default it to 'TBD'
        return difficulty || 'TBD';
    }
}
