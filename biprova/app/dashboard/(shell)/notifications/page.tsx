import { Card, CardContent } from "@/components/ui/card";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-nunito font-black text-h2 text-ink">Bildirimler</h1>
      <Card>
        <CardContent className="p-10 text-center text-ink-subtle text-lead">
          Henüz bildirim yok.
        </CardContent>
      </Card>
    </div>
  );
}
