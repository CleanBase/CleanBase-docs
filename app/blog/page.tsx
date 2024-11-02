import { Metadata } from 'next';
import { queryNotionDatabase } from '@/lib/notion';
import BlogFilter from '@/components/BlogFilter';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';


const IndexPage = async () => {
  const posts = await queryNotionDatabase(process.env.NOTION_DATABASE_ID as string);
  
    return (
    <Layout>
      <Seo
          templateTitle='Blog'
          description='Thoughts, mental models, and tutorials about front-end development.' pathname={"/blog"}      />
      <main>
        <section>
          <h1 className='text-3xl mb-2 font-bold'>Blog</h1>
          <BlogFilter posts={posts} />
        </section>
      </main>
    </Layout>
  );
};

export default IndexPage;
