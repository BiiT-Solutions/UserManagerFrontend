module.exports = {
  rootTranslationsPath: 'src/assets/i18n/',
  langs: ['en', 'es', 'nl'],
  keysManager: {},
  scopedLibs: [
    {
      src: './projects/biit-ui/lib1',
      dist: ['./src/assets/i18n/biit-ui']
    }
  ]

};
