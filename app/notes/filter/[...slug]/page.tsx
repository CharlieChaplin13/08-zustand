
import { Metadata } from "next"
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import NotesClient from "./NotesPage.client";
import { fetchNotes } from '@/lib/api'
import type { NoteTag } from "@/types/note";

type NotesByCategoryProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: NotesByCategoryProps): Promise<Metadata> {
  const { slug } = await params
  const currentTag = (slug && slug.length > 0 ? slug[0] : 'all') as NoteTag | 'all';
  return {
    title: `Note: ${currentTag}`
  }
}

const NotesByCategory = async ({ params }: NotesByCategoryProps) => {
  const { slug } = await params;
  const currentTag = (slug && slug.length > 0 ? slug[0] : 'all') as NoteTag | 'all';

    const queryClient = new QueryClient();

      await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, currentTag],
    queryFn: () => fetchNotes({ page: 1, tag: currentTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={currentTag} />
    </HydrationBoundary>
  );

  
};


export default NotesByCategory;






