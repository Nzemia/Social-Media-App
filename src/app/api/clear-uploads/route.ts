import prisma from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

{/**after deployment, delete all unused media files at 2am*/}
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        { message: "Invalid authentication header" },
        { status: 401 },
      );
    }

    const unUsedMediaFiles = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    new UTApi().deleteFiles(
      unUsedMediaFiles.map(
        (media) =>
          media.url.split(
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
          )[1],
      ),
    );

    await prisma.media.deleteMany({
      where: {
        id: {
          in: unUsedMediaFiles.map((media) => media.id),
        },
      },
    });

    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
