import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

interface PostMeta {
    date: String;
    title: String;
}

export interface PostData extends PostMeta {
    id: string
    contentHtml?: string
}

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData(): PostData[] {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName): PostData => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult: any = matter(fileContents).data;

        const matterMeta: PostMeta = {
            date: matterResult.date || "",
            title: matterResult.title || "No Title"
        };

        // Combine the data with the id
        return {
            id,
            ...matterMeta,
        };
    });
    // Sort posts by date
    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        } else {
            return 0;
        }
    });
}

export interface StaticParam<T> {
    params: T;
}

export interface FileNameObject {
    id: string
}

export function getAllPostIds(): StaticParam<FileNameObject>[] {
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map((fileName): StaticParam<FileNameObject> => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            }
        };
    });
}

export async function getPostData(id: string): Promise<PostData> {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    const matterResultData = matterResult.data;

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
  
    const contentHtml = processedContent.toString();

    const matterMeta: PostMeta = {
        date: matterResultData.date as string || "",
        title: matterResultData.title as string || "No Title",
    };

    console.log('--- ' + contentHtml);
    return {
        id,
        contentHtml,
        ...matterMeta,
    };
}