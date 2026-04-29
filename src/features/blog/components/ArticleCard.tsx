import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BlogPost } from "../data/cmsBlog";

interface ArticleCardProps {
  post: BlogPost;
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group flex flex-col gap-4 overflow-hidden h-full">
      <Link href={post.href} className="block overflow-hidden rounded-lg aspect-[4/3] w-full">
        <Image
          src={post.image}
          alt={post.title}
          width={600}
          height={450}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-col flex-1 gap-2 pt-2">
        <Link href={post.href} className="group-hover:text-primary-orange transition-colors">
          <h3 className="heading-h6 font-bold text-gray-900 line-clamp-2 text-wrap break-words whitespace-normal">
            {post.title}
          </h3>
        </Link>
        <div className="mt-auto pt-2">
          <Link
            href={post.href}
            className="inline-flex items-center gap-2 text-gray-900 font-medium text-body-medium group-hover:text-primary-orange transition-colors"
          >
            Saber más <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
