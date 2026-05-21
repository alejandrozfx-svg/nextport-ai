import { LessonDetail } from "@/components/academy/LessonDetail";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params;
  return <LessonDetail lessonId={lessonId} />;
}
