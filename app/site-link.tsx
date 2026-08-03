import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { sitePath } from "./site-path";

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};

const isStaticSite = Boolean(process.env.NEXT_PUBLIC_SITE_BASE_PATH);

export default function SiteLink({ href, ...props }: SiteLinkProps) {
  const target = sitePath(href);
  return isStaticSite ? <a href={target} {...props} /> : <Link href={target} {...props} />;
}
