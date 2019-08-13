// import Vuesora from '../../dist/vuesora.common';
import VideoPlayer from '../../src/components/VideoPlayer';
import '../../src/assets/sass/app.scss';

export default ({
    Vue,
    options,
    router,
    siteData
}) => {
    // Vue.use(Vuesora)
    Vue.use(VideoPlayer)
}