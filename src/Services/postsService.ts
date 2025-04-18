import http from "./httpService";
import { getAuthHeader } from "./userService";

const apiEndpoint = "/posts";

// =====|  Posts Service  |=====

const PostsService = {
  getAllPosts: () => http.get(`${apiEndpoint}`, { headers: getAuthHeader() }),
  getPostById: (id: string) =>
    http.get(`${apiEndpoint}/post/${id}`, { headers: getAuthHeader() }),
  getPostsOfInfluencer: (brandId: string) =>
    http.get(`${apiEndpoint}/posts-of-user/${brandId}`, {
      headers: getAuthHeader(),
    }),
  addPost: (data: any) =>
    http.post(`${apiEndpoint}/add-post`, data, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
    }),
  editPost: (id: string, formData: any) =>
    http.put(`${apiEndpoint}/edit-post/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
    }),
  deletePost: (id: string) =>
    http.delete(`${apiEndpoint}/delete-post/${id}`, {
      headers: getAuthHeader(),
    }),
};

// =====|  APIs  |=====

export const getAllPosts = () => PostsService.getAllPosts();

export const getPostById = (id: string) => PostsService.getPostById(id);

export const addPost = (data: any) => PostsService.addPost(data);

export const editPost = (id: string, formData: any) =>
  PostsService.editPost(id, formData);

export const deletePost = (id: string) => PostsService.deletePost(id);

export const getPostsOfInfluencer = (brandId: string) =>
  PostsService.getPostsOfInfluencer(brandId);
