import ImgixClient from 'imgix-core-js';

export default class ImgixService {
    constructor(token) {
        this.client = new ImgixClient({
            domain: 'musora.imgix.net',
            secureURLToken: token,
        });

        this.getDefaultParams();

        this.init();
    }

    /**
     * Initialize the Service, loading all image sources and backgrounds
     */
    init() {
        this.loadImageSources();

        this.loadBackgroundImages();
    }

    /**
     * Load all the image sources that have a [data-ix-src] attribute
     */
    loadImageSources() {
        const images = document.querySelectorAll('[data-ix-src]:not(.ix-loaded)');

        Array.from(images)
            .forEach((image) => {
                this.addSource(image);

                image.addEventListener('load', this.addLoadedClass);
            });
    }

    /**
     * Load all the image backgrounds that have a [data-ix-bg] attribute
     */
    loadBackgroundImages() {
        const backgroundImages = document.querySelectorAll('[data-ix-bg]');

        Array.from(backgroundImages)
            .forEach((container) => {
                this.addBackgroundStyle(container);
            });
    }

    /**
     * Load all the image backgrounds that have a [data-ix-bg] attribute
     */
    reloadCommentImages() {
        const images = document.querySelectorAll('.comment-post [data-ix-src]');

        Array.from(images)
            .forEach((image) => {
                window.ImgixService.addSource(image);

                image.addEventListener('load', this.addLoadedClass);
            });
    }

    /**
     * Create default params to use in imgix requests
     */
    getDefaultParams() {
        this.defaultParams = {
            fit: 'crop',
            crop: 'faces,edges',
            auto: 'format',
        };
    }

    /**
     * Add a source to an image
     *
     * @param {HTMLElement} image - the image element to attach a source to
     */
    addSource(image) {
        const preload = new Image();
        preload.src = this.client.buildURL(image.dataset.ixSrc, {
            ...this.defaultParams,
            w: image.clientWidth,
            h: image.clientHeight,
            dpr: window.devicePixelRatio || 1,
        });

        preload.addEventListener('load', () => {
            setTimeout(() => {
                image.src = preload.src;

                this.addSourceSet(image);
            }, 100);

            preload.remove();
        });
    }

    /**
     * Add a sourceset to an image
     *
     * @param {HTMLElement} image - the image element to attach a sourceset to
     */
    addSourceSet(image) {
        image.srcset = this.client.buildSrcSet(image.dataset.ixSrc, {
            ...this.defaultParams,
            w: image.clientWidth,
            h: image.clientHeight,
        });
    }

    /**
     * Add a sourceset to an image
     *
     * @param {Event} event
     */
    addLoadedClass(event) {
        const image = event.target;

        image.classList.add('ix-loaded');

        image.removeEventListener('load', this.addLoadedClass);
    }

    /**
     * Add a background image to a container
     *
     * @param {HTMLElement} container - the container to add a background image to
     */
    addBackgroundStyle(container) {
        const preload = new Image();
        preload.src = this.client.buildURL(container.dataset.ixBg, {
            ...this.defaultParams,
            w: container.clientWidth,
            dpr: window.devicePixelRatio || 1,
        });

        preload.addEventListener('load', () => {
            setTimeout(() => {
                container.style.backgroundImage = `url(${preload.src})`;
            }, 500);

            preload.remove();
        });
    }
}
