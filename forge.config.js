module.exports = {
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'elcondorpasa123',
          name: 'github-repo-name',
        },
        prerelease: false,
        draft: true,
      },
    },
  ],
}