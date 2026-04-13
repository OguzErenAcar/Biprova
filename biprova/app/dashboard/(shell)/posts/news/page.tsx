import { ContentHeader } from "@/components/shared/content-header";
import { NewsFeed } from "./_components/news-feed";

export default function NewsPage() {
  return (
    <>
      <ContentHeader title="Biprova haberler"></ContentHeader>
      <NewsFeed />
    </>
  );
}
