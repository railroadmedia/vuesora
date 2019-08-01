module.exports = {
    productionSourceMap: false,
    filenameHashing: false,
    css: {
        extract: false,
    },
    chainWebpack: (config) => {
        config.plugins.delete('html');
        config.plugins.delete('preload');
        config.plugins.delete('prefetch');
        config.plugins.delete('hmr');
        config.optimization.delete('splitChunks');
    },
};
