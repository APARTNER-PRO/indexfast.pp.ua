import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug } from '@/lib/mdx';
import Link from 'next/link';

// You can add custom MDX components here
const mdxComponents = {
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} style={{ width: '100%', borderRadius: '16px', margin: '24px 0', objectFit: 'cover' }} alt={props.alt || 'Blog Image'} />
  ),
  a: (props) => <Link {...props} />
};

export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const post = getPostBySlug(slug, 'blog', lang);
  
  if (!post) {
    return { title: 'Not Found' };
  }
  
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [post.frontmatter.image],
    }
  };
}

export default async function BlogPost({ params }) {
  const { slug, lang } = await params;
  
  if (!slug.endsWith('.html')) {
    return notFound();
  }

  const post = getPostBySlug(slug, 'blog', lang);
  
  if (!post) {
    return notFound();
  }

  return (
    <div className="page-wrap">
      <article>
        <div className="article-meta">
          <span className="meta-tag">{post.frontmatter.tag}</span>
          <span className="meta-date">{post.frontmatter.date}</span>
          <span className="meta-read">⏱ {post.frontmatter.readTime}</span>
        </div>

        <h1>{post.frontmatter.title}</h1>
        {/* Main Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={post.frontmatter.image} 
          alt={post.frontmatter.title} 
          className="article-main-image" 
          style={{ width: '100%', borderRadius: '16px', margin: '24px 0', objectFit: 'cover', aspectRatio: '1200/630' }} 
        />

        <div className="article-body">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </article>
      
      {/* Sidebar can be added here or in layout */}
    </div>
  );
}
