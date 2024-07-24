import ChatWrapper from "@/components/chat/ChatWrapper";
import PdfRenderer from "@/components/PdfRenderer";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: { fileId: string };
}

const Page = async ({ params }: PageProps) => {
  const { fileId } = params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect(`/auth-callback?origin=dashboard/${fileId}`);
  }

  const file = await db.file.findFirst({
    where: { id: fileId, userId: user.id },
  });

  if (!file) {
    notFound();
  }

  return (
    <div className="flex flex-col flex-1 justify-between h-[calc(100vh-3.5rem)]">
      <div className="lg:flex mx-auto xl:px-2 w-full max-w-8xl grow">
        <div className="xl:flex flex-1">
          <div className="xl:flex-1 px-4 sm:px-6 py-6 lg:pl-8 xl:pl-6">
            <PdfRenderer url={file.url} />
          </div>
        </div>

        <div className="flex-[0.75] border-gray-200 border-t lg:border-t-0 lg:border-l shrink-0">
          <ChatWrapper fileId={file.id} />
        </div>
      </div>
    </div>
  );
};

export default Page;