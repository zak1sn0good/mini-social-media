import { gql } from "@apollo/client";

export const GET_POSTS_QUERY = gql`
  query Query {
    getPosts {
      id
      body
      username
      createdAt
      commentsCount
      likesCount
      comments{
        id
        createdAt
        username
        body
      }
      likes{
        id
        createdAt
        username
      }
    }
  } 
`;

export const CREATE_POST_MUTATION = gql`
mutation CreatePost($body: String!) {
  createPost(body: $body) {
    id
    body
    createdAt
    username
    comments {
      id
      createdAt
      username
      body
    }
    likes {
      id
      createdAt
      username
    }
    likesCount
    commentsCount
  }
}
`;

export const LIKE_POST_MUTATION = gql`
mutation LikePost($postId: ID!) {
  likePost(postId: $postId) {
    id
    body
    createdAt
    username
    comments {
      id
      createdAt
      username
      body
    }
    likes {
      id
      createdAt
      username
    }
    likesCount
    commentsCount
  }
}
`;

export const DELETE_POST_MUTATION = gql`
mutation DeletePost($postId: ID!) {
  deletePost(postId: $postId)
}
`;

export const GET_POST_QUERY = gql`
query GetPost($postId: ID!) {
  getPost(postId: $postId) {
    id
    body
    createdAt
    username
    comments {
      id
      createdAt
      username
      body
    }
    likes {
      id
      createdAt
      username
    }
    likesCount
    commentsCount
  }
}
`;

export const CREATE_COMMENT_MUTATION = gql`
mutation CreateComment($postId: ID!, $body: String!) {
  createComment(postId: $postId, body: $body) {
    id
    body
    createdAt
    username
    comments {
      id
      createdAt
      username
      body
    }
    likes {
      id
      createdAt
      username
    }
    likesCount
    commentsCount
  }
}
`;