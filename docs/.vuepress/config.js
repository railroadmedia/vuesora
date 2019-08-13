module.exports = {
    title: 'Vuesora',
    base: '/vuesora/',
    description: 'A custom front-end framework and Vue component library for the Musora member\'s area',
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }],
        ['link', {rel: 'stylesheet', href: 'https://dmmior4id2ysr.cloudfront.net/assets/FontAwesome/css/fontawesome-all.min.css'}],
        ['link', {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,700|Roboto+Condensed:400,700'}],
        ['link', {rel: 'stylesheet', href: 'https://dpwjbsxqtam5n.cloudfront.net/fonts/icons.css'}],
    ],
    evergreen: true,
    themeConfig: {
        logo: '/logo.png',
        displayAllHeaders: true,
        repo: 'railroadmedia/vuesora',
        nav: [
            {
                text: 'Usage Guide',
                link: '/'
            },
            {
                text: 'Layout & Styles',
                link: '/layout/'
            },
            {
                text: 'Components',
                link: '/components/'
            },
            {
                text: 'Style Guide',
                link: '/style-guide/'
            },
        ],
        sidebar: 'auto',
        lastUpdated: 'Last Updated',
    }
};