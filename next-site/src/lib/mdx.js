import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'src/content');

export function getPostBySlug(slug, folder = 'blog', lang = 'uk') {
  const realSlug = slug.replace(/\.html$/, '');
  
  if (lang && lang !== 'uk') {
    const langPath = path.join(contentDir, folder, lang, `${realSlug}.mdx`);
    if (fs.existsSync(langPath)) {
      const fileContents = fs.readFileSync(langPath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        slug: realSlug,
        frontmatter: data,
        content
      };
    }
  }
  
  const fullPath = path.join(contentDir, folder, `${realSlug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug: realSlug,
    frontmatter: data,
    content
  };
}

export function getAllPosts(folder = 'blog', lang = 'uk') {
  const dir = path.join(contentDir, folder);
  if (!fs.existsSync(dir)) return [];
  
  const files = fs.readdirSync(dir);
  const posts = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace(/\.mdx$/, '');
      return getPostBySlug(slug, folder, lang);
    })
    .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
    
  return posts;
}
