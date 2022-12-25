module.exports = {
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'elcondorpasa123',
          name: 'electron_app',
        },
        prerelease: false,
        draft: true,
      },
    },
  ],
}