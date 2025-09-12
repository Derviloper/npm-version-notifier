import { request } from "@octokit/request";
import pacote from "pacote";

const specs = ["vite", "something"];

await Promise.all(
  specs.map(async (spec) => {
    const { name, repository, version } = await pacote.manifest(spec, {
      fullMetadata: true,
    });
    const gitUrl = repository?.url;
    if (!gitUrl?.startsWith("git+https://github.com/")) return;
    const match = /^git\+https:\/\/github\.com\/(.+)\/(.+)\.git$/.exec(gitUrl);
    if (!match) return;
    const [, owner, repo] = match;
    if (!owner || !repo) return;
    console.log(name, version, owner, repo);
    const release = await request(
      "GET /repos/{owner}/{repo}/releases/tags/{tag}",
      { owner, repo, tag: `v${version}` }
    );
    console.log(release);
  })
);
