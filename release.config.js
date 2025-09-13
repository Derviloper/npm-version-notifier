/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@codedependant/semantic-release-docker",
    "@semantic-release/github",
  ],
  preset: "conventionalcommits",
};
