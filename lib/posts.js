import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostData() {
    // get file name under /posts
    const fileNames = fs.readdirSync(postDirectory)
    const allPostData = fileNames.map((fileName) => {
        // remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')

        // read markdown file as string
        const fullPath = path.join(postDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf-8')

        // use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // combile the ddata with id
        return {
            id, 
            ...matterResult.data
        }
    })

    return allPostData.sort((a, b) => {
        if(a.date < b.date) {
            return 1
        }else{
            return -1
        }
    })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postDirectory)
    // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]

  return fileNames.map((fileName) => {
    return {
        params: {
            id: fileName.replace(/\.md$/, '')
        }
    }
  })
}

export async function getPostData(id){
    const fullPath = path.join(postDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf-8')

    // use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // use remark to convert markdown into html string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)

    const contentHtml = processedContent.toString()    

    // combile the data with the id
    return {
        id, 
        contentHtml,
        ...matterResult.data
    }
}