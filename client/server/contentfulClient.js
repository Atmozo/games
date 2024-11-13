
import { createClient } from 'contentful';

export const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE,
accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
});

export const fetchPosts = async () => {
  const response = await client.getEntries({ content_type: 'blogPost' });
  return response.items;
};
