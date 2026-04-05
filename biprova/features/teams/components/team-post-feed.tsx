import { getTeamPostFeed } from "@/features/teams/actions";
import { TeamPostFeedClient } from "./team-post-feed-client";

export async function TeamPostFeed() {
  const posts = await getTeamPostFeed();
  return <TeamPostFeedClient posts={posts} />;
}
