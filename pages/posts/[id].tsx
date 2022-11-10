import utilStyles from '../../styles/utils.module.css';

import Head from 'next/head';
import Date from '../../components/date'

import Layout from '../../components/layout';
import { getAllPostIds, FileNameObject, getPostData, PostData, StaticParam } from '../../lib/posts';

export default function Post({postData}:{postData:PostData}) {
  return (
    <Layout home={false}>
      <Head>
        <title>{postData.title}</title>
        
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
      </article>
      <div className={utilStyles.lightText}>
        <Date dateString={postData.date} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  );
}

interface AllPostIds {
  paths: StaticParam<FileNameObject>[];
  fallback: boolean;
}

interface PostDataProps {
  postData: PostData;
}

export async function getStaticPaths():Promise<AllPostIds> {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  console.log(postData);
  return {
    props: {
      postData,
    },
  };
}
