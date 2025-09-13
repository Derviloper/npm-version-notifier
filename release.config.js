/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  plugins: [
    "@semantic-release/commit-analyzer",
    [
      "@semantic-release/exec",
      {
        verifyReleaseCmd:
          'echo "NEXT_RELEASE_VERSION=${nextRelease.version}" >> "$GITHUB_OUTPUT"',
      },
    ],
    "@semantic-release/release-notes-generator",
    "@codedependant/semantic-release-docker",
    "@semantic-release/github",
  ],
  preset: "conventionalcommits",
};
