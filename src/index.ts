import "dotenv/config";
import { request } from "@octokit/request";
import { RequestError } from "@octokit/request-error";
import { CronJob } from "cron";
import { ButtonStyle, ComponentType, WebhookClient } from "discord.js";
import pacote from "pacote";

if (!process.env.SPECS) {
  throw new Error("SPECS enviroment variable missing!");
}

if (!process.env.CRON_TIME) {
  throw new Error("CRON_TIME enviroment variable missing!");
}

if (!process.env.DISCORD_WEBHOOK_ID) {
  throw new Error("DISCORD_WEBHOOK_ID enviroment variable missing!");
}

if (!process.env.DISCORD_WEBHOOK_TOKEN) {
  throw new Error("DISCORD_WEBHOOK_TOKEN enviroment variable missing!");
}

const specs = process.env.SPECS.split(" ");

const discordClient = new WebhookClient({
  id: process.env.DISCORD_WEBHOOK_ID,
  token: process.env.DISCORD_WEBHOOK_TOKEN,
});

const githubApi = request.defaults({
  headers: {
    authorization: process.env.GITHUB_TOKEN
      ? `token ${process.env.GITHUB_TOKEN}`
      : undefined,
  },
});

type Release = {
  name: string;
  packageUrl: string;
  repository?: { owner: string; repo: string; url: string };
  version: string;
};

async function checkRelease(spec: string) {
  const release = await getRelease(spec);
  if (release.version === releases[spec]?.version) return;
  releases[spec] = release;
  await notify(release);
}

async function getRelease(spec: string) {
  const { name, repository, version } = await pacote.manifest(spec, {
    fullMetadata: true,
  });
  const release: Release = {
    name,
    packageUrl: `https://www.npmjs.com/package/${name}`,
    version,
  };
  const repositoryUrl = repository?.url;
  if (!repositoryUrl?.startsWith("git+https://github.com/")) return release;

  const match = /^git\+https:\/\/github\.com\/(.+)\/(.+)\.git$/.exec(
    repositoryUrl
  );
  if (!match) return release;
  const [, owner, repo] = match;
  if (!owner || !repo) return release;
  release.repository = {
    owner,
    repo,
    url: `https://github.com/${owner}/${repo}`,
  };
  return release;
}

async function getReleaseNotes(release: Release) {
  if (!release.repository) return;
  try {
    const githubRelease = await githubApi(
      "GET /repos/{owner}/{repo}/releases/tags/{tag}",
      {
        owner: release.repository.owner,
        repo: release.repository.repo,
        tag: `v${release.version}`,
      }
    );
    const notes = githubRelease.data.body;
    if (!notes) return;
    return notes;
  } catch (error) {
    if (!(error instanceof RequestError) || error.status !== 404) {
      console.warn(error);
    }
  }
}

async function notify(release: Release) {
  const notes = await getReleaseNotes(release);
  await discordClient.send({
    components: [
      {
        components: [
          {
            label: "test",
            style: ButtonStyle.Link,
            type: ComponentType.Button,
            url: "https://google.de",
          },
        ],
        type: ComponentType.ActionRow,
      },
    ],
    embeds: [
      {
        description: notes,
        title: `${release.name}@${release.version}`,
        url: release.repository?.url ?? release.packageUrl,
      },
    ],
    username: "npm-version-notifier",
  });
}

const releases = Object.fromEntries(
  await Promise.all(
    specs.map(async (spec) => [spec, await getRelease(spec)] as const)
  )
);

new CronJob(
  process.env.CRON_TIME,
  async () => {
    await Promise.all(specs.map((spec) => checkRelease(spec)));
  },
  undefined,
  true,
  "utc"
);

await discordClient.send({
  content: "NPM Version Notifier started",
  username: "npm-version-notifier",
});
