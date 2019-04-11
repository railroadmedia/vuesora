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

export default class ContentModel {
    constructor(type, {
        brand,
        post
    }){
        const model = ContentModel.models()[type];

        if(model){
            return new model({brand, post});
        }

        return ContentModel.models()['recording']({brand, post});
    }

    static models() {
        return {
            'chord-and-scale': ChordsAndScalesModel,
            'course': CourseModel,
            'course-part': CoursePartModel,
            'learning-path': LearningPathModel,
            'learning-path-part': LearningPathPartModel,
            'pack-bundle': PackBundleModel,
            'pack-bundle-lesson': PackBundleLessonModel,
            'play-along': PlayAlongModel,
            'play-along-part': PlayAlongPartModel,
            'recording': RecordingModel,
            'rudiment': RudimentModel,
            'semester-pack': SemesterPackModel,
            'semester-pack-lesson': SemesterPackLessonModel,
            'show': ShowModel,
            'song': SongModel,
            'song-part': SongPartModel,
            'student-focus': StudentFocusModel,
            'student-review': StudentReviewModel,
            'question-and-answer': QnaModel,
            'unit': UnitModel,
            'unit-part': UnitPartModel,
        };
    }
}