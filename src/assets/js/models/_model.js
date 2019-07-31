import ChordsAndScalesModel from './chords-and-scales';
import CourseModel from './course';
import CoursePartModel from './course-part';
import LearningPathModel from './learning-path';
import LearningPathPartModel from './learning-path-part';
import PackBundleModel from './pack-bundle';
import PackBundleLessonModel from './pack-bundle-lesson';
import PlayAlongModel from './play-along';
import PlayAlongPartModel from './play-along-part';
import RecordingModel from './recording';
import RudimentModel from './rudiment';
import SemesterPackModel from './semester-pack';
import SemesterPackLessonModel from './semester-pack-lesson';
import ShowModel from './show';
import SongModel from './song';
import SongPartModel from './song-part';
import StudentFocusModel from './student-focus';
import StudentReviewModel from './student-review';
import QnaModel from './question-and-answer';
import UnitModel from './unit';
import UnitPartModel from './unit-part';
import ContentModel from './_default';

/**
 * Map the data of a specific content type to a model
 *
 * @param {String} type - The content type to map
 * @param {String} brand - The brand to map the content for
 * @param {Object} post - The post object you wish to map
 * @returns {ContentModel}
 */
export default class ContentTypeModel {
    constructor(type, {
        brand,
        post,
    }) {
        switch (type) {
        case 'chord-and-scale': return new ChordsAndScalesModel({ brand, post });
        case 'course': return new CourseModel({ brand, post });
        case 'course-part': return new CoursePartModel({ brand, post });
        case 'learning-path': return new LearningPathModel({ brand, post });
        case 'learning-path-part': return new LearningPathPartModel({ brand, post });
        case 'pack-bundle': return new PackBundleModel({ brand, post });
        case 'pack-bundle-lesson': return new PackBundleLessonModel({ brand, post });
        case 'play-along': return new PlayAlongModel({ brand, post });
        case 'play-along-part': return new PlayAlongPartModel({ brand, post });
        case 'recording': return new RecordingModel({ brand, post });
        case 'rudiment': return new RudimentModel({ brand, post });
        case 'semester-pack': return new SemesterPackModel({ brand, post });
        case 'semester-pack-lesson': return new SemesterPackLessonModel({ brand, post });
        case 'show': return new ShowModel({ brand, post });
        case 'song': return new SongModel({ brand, post });
        case 'song-part': return new SongPartModel({ brand, post });
        case 'student-focus': return new StudentFocusModel({ brand, post });
        case 'student-review': return new StudentReviewModel({ brand, post });
        case 'question-and-answer': return new QnaModel({ brand, post });
        case 'unit': return new UnitModel({ brand, post });
        case 'unit-part': return new UnitPartModel({ brand, post });
        default: return new ContentModel({ brand, post });
        }
    }
}
