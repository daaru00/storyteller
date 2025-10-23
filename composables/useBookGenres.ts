export default function () {
  const i18n = useI18n()

  return {
    GENRES: [{
      id: 'adventure',
      name: i18n.t('genres.adventure')
    }, {
      id: 'fantasy',
      name: i18n.t('genres.fantasy')
    }, {
      id: 'sci-fi',
      name: i18n.t('genres.sci-fi')
    }, {
      id: 'crime',
      name: i18n.t('genres.crime')
    }, {
      id: 'romance',
      name: i18n.t('genres.romance')
    }, {
      id: 'horror',
      name: i18n.t('genres.horror')
    }, {
      id: 'kids',
      name: i18n.t('genres.kids')
    }]
  }
}
