import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'src/content');

export function getPostBySlug(slug, folder = 'blog') {
  // If slug has .html, remove it to find the .mdx file
  const realSlug = slug.replace(/\.html$/, '');
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

export function getAllPosts(folder = 'blog') {
  const dir = path.join(contentDir, folder);
  if (!fs.existsSync(dir)) return [];
  
  const files = fs.readdirSync(dir);
  const posts = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace(/\.mdx$/, '');
      return getPostBySlug(slug, folder);
    })
    .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
    
  return posts;
}
