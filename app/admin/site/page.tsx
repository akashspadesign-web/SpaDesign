import {
  FOUNDER_PHOTO_DEFAULT,
  getFounderPhotoUrl,
} from "@/lib/settings-repo";
import FounderPhotoForm from "@/components/admin/FounderPhotoForm";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const founderPhotoUrl = await getFounderPhotoUrl();
  const isDefault = founderPhotoUrl === FOUNDER_PHOTO_DEFAULT;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
            Site Content
          </p>
          <h1 className="mt-2 font-serif text-4xl tracking-tightish text-ink">
            Founder Photo
          </h1>
        </div>
      </div>

      <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
        Upload a new image, take a photo, or paste a path. The landing page
        founder section reads from this setting. Reset to default to fall back
        to the bundled <code className="font-mono text-[0.7rem]">/images/founders.jpg</code>.
      </p>

      <div className="mt-10">
        <FounderPhotoForm
          initialUrl={founderPhotoUrl}
          defaultUrl={FOUNDER_PHOTO_DEFAULT}
          isDefault={isDefault}
        />
      </div>
    </div>
  );
}
