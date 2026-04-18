import { Separator } from "@/components/ui/separator";
import { FeaturedNewsCard } from "./featured-news-card";
import { NewsCard } from "./news-card";
import { NEWS_ITEMS } from "./news-data";

const featured = NEWS_ITEMS.find((n) => n.featured)!;
const latest = NEWS_ITEMS.filter((n) => !n.featured && n.tag !== "girişim");
const startup = NEWS_ITEMS.filter((n) => n.tag === "girişim");

export function NewsFeed() {
  return (
    <div className="feed-center-wrapper">
    <div id="news-feed" className="shell_content">
      <FeaturedNewsCard
        id={featured.id}
        title={featured.title}
        excerpt={featured.excerpt}
        tags={featured.tags!}
        date={featured.date}
      />

      {latest.map((post) => (
        <NewsCard
          key={post.id}
          id={post.id}
          title={post.title}
          excerpt={post.excerpt}
          tag={post.tag!}
          date={post.date}
          readTime={post.readTime!}
        />
      ))}

      <div className="flex items-center gap-3 my-6">
        <span className="font-nunito font-black text-lead text-ink whitespace-nowrap">
          Girişim Haberleri
        </span>
        <Separator className="flex-1" />
      </div>

      {startup.map((post) => (
        <NewsCard
          key={post.id}
          id={post.id}
          title={post.title}
          excerpt={post.excerpt}
          tag={post.tag!}
          date={post.date}
          readTime={post.readTime!}
        />
      ))}
    </div>
  );
}
