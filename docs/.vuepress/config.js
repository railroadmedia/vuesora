module.exports = {
    title: 'Vuesora',
    base: '/vuesora/',
    description: 'A custom front-end framework and Vue component library for the Musora member\'s area',
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }]
    ],
    evergreen: true,
    themeConfig: {
        logo: '/logo.png',
        displayAllHeaders: true,
        nav: [
            {
                text: 'Project Setup',
                link: '/'
            },
            {
                text: 'Layout & Style',
                link: '/layout/'
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