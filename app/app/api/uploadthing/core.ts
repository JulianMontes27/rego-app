import { auth } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

//handle auth
const handleAuth = async () => {
  const session = await auth();
  if (!session?.user) throw new UploadThingError("Unauthorized");
  return { user: session.user }; // Wrap user in an object
};
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  brandLogoImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  messageFile: f(["image", "pdf"]) //for pdfs AND images
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
