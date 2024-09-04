import React from 'react'
import MainContext from './MainContext';
import { getRequest, postRequest, putRequest, deleteRequest } from '@/Api/Api';

// export const baseUrl = 'http://localhost:5000';
export const baseUrl = 'https://seahorse-app-agn6w.ondigitalocean.app';

const MainState = (props) => {
  const getBlogs = async (id, slug, status, query, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/blog/getBlogs?id=${id}&slug=${slug}&status=${status}&query=${query}&page=${page}&perPage=${perPage}`, false, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postBlog = async ({ title, subTitle, writtenBy, file, tags, desc, slug }) => {
    try {
      let formdata = new FormData();
      formdata.append('title', title);
      formdata.append('file', file);
      formdata.append('subTitle', subTitle);
      formdata.append('writtenBy', writtenBy);
      formdata.append('tags', tags);
      formdata.append('desc', desc);
      formdata.append('slug', slug);

      const data = await postRequest(`${baseUrl}/blog/postBlog`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateBlog = async ({ id, title, subTitle, writtenBy, file, tags, desc, slug }) => {
    try {
      let formdata = new FormData();
      formdata.append('title', title);
      formdata.append('file', file);
      formdata.append('subTitle', subTitle);
      formdata.append('writtenBy', writtenBy);
      formdata.append('tags', tags);
      formdata.append('desc', desc);
      formdata.append('slug', slug);

      const data = await putRequest(`${baseUrl}/blog/updateBlog/${id}`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/blog/deleteBlog/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoBlog = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/blog/undoBlog/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllBlogs = async () => {
    try {
      const data = await deleteRequest(`${baseUrl}/blog/deleteAllBlogs`, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getAbouts = async (id, slug, status, query, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/about/getAbouts?id=${id}&slug=${slug}&status=${status}&query=${query}&page=${page}&perPage=${perPage}`, false, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postAbout = async ({ title, img, desc, subImg1, subDesc1, subImg2, subDesc2, subImg3, subDesc3 }) => {
    try {
      const data = await postRequest(`${baseUrl}/about/postAbout`, { title, img, desc, subImg1, subDesc1, subImg2, subDesc2, subImg3, subDesc3 }, false, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateAbout = async ({ id, title, img, desc, subImg1, subDesc1, subImg2, subDesc2, subImg3, subDesc3 }) => {
    try {
      const data = await putRequest(`${baseUrl}/about/updateAbout/${id}`, { title, img, desc, subImg1, subDesc1, subImg2, subDesc2, subImg3, subDesc3 }, false, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAbout = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/about/deleteAbout/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoAbout = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/about/undoAbout/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllAbouts = async () => {
    try {
      const data = await deleteRequest(`${baseUrl}/About/deleteAllAbouts`, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getTestimonials = async (id, status, query, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/testimonial/getTestimonials?id=${id}&status=${status}&query=${query}&page=${page}&perPage=${perPage}`, false, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postTestimonial = async ({ name, designation, comment, file }) => {
    try {
      let formdata = new FormData();
      formdata.append('name', name);
      formdata.append('file', file);
      formdata.append('designation', designation);
      formdata.append('comment', comment);

      const data = await postRequest(`${baseUrl}/testimonial/postTestimonial`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateTestimonial = async ({ id, name, designation, comment, file }) => {
    try {
      let formdata = new FormData();
      formdata.append('name', name);
      formdata.append('file', file);
      formdata.append('designation', designation);
      formdata.append('comment', comment);

      const data = await putRequest(`${baseUrl}/testimonial/updateTestimonial/${id}`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/testimonial/deleteTestimonial/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoTestimonial = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/testimonial/undoTestimonial/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllTestimonials = async () => {
    try {
      const data = await deleteRequest(`${baseUrl}/testimonial/deleteAllTestimonials`, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getCareers = async (id, status, query, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/career/getCareers?id=${id}&status=${status}&query=${query}&page=${page}&perPage=${perPage}`, false, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postCareer = async ({ title, subTitle, file, desc }) => {
    try {
      let formdata = new FormData();
      formdata.append('title', title);
      formdata.append('file', file);
      formdata.append('subTitle', subTitle);
      formdata.append('desc', desc);

      const data = await postRequest(`${baseUrl}/career/postCareer`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateCareer = async ({ id, title, subTitle, file, desc, slug }) => {
    try {
      let formdata = new FormData();
      formdata.append('title', title);
      formdata.append('file', file);
      formdata.append('subTitle', subTitle);
      formdata.append('desc', desc);

      const data = await putRequest(`${baseUrl}/career/updateCareer/${id}`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCareer = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/career/deleteCareer/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoCareer = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/career/undoCareer/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllCareers = async () => {
    try {
      const data = await deleteRequest(`${baseUrl}/career/deleteAllCareers`, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getPartners = async (id, slug, status, query, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/partner/getPartners?id=${id}&slug=${slug}&status=${status}&query=${query}&page=${page}&perPage=${perPage}`, false, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postPartner = async ({ title, subTitle, writtenBy, file, tags, desc, slug }) => {
    try {
      let formdata = new FormData();
      formdata.append('title', title);
      formdata.append('file', file);
      formdata.append('subTitle', subTitle);
      formdata.append('writtenBy', writtenBy);
      formdata.append('tags', tags);
      formdata.append('desc', desc);
      formdata.append('slug', slug);

      const data = await postRequest(`${baseUrl}/partner/postPartner`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updatePartner = async ({ id, title, subTitle, writtenBy, file, tags, desc, slug }) => {
    try {
      let formdata = new FormData();
      formdata.append('title', title);
      formdata.append('file', file);
      formdata.append('subTitle', subTitle);
      formdata.append('writtenBy', writtenBy);
      formdata.append('tags', tags);
      formdata.append('desc', desc);
      formdata.append('slug', slug);

      const data = await putRequest(`${baseUrl}/partner/updatePartner/${id}`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deletePartner = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/partner/deletePartner/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoPartner = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/partner/undoPartner/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllPartners = async () => {
    try {
      const data = await deleteRequest(`${baseUrl}/partner/deleteAllPartners`, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getCharitys = async (id, slug, status, query, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/charity/getCharitys?id=${id}&slug=${slug}&status=${status}&query=${query}&page=${page}&perPage=${perPage}`, false, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postCharity = async ({ title, subTitle, writtenBy, file, tags, desc, slug }) => {
    try {
      let formdata = new FormData();
      formdata.append('title', title);
      formdata.append('file', file);
      formdata.append('subTitle', subTitle);
      formdata.append('writtenBy', writtenBy);
      formdata.append('tags', tags);
      formdata.append('desc', desc);
      formdata.append('slug', slug);

      const data = await postRequest(`${baseUrl}/charity/postCharity`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateCharity = async ({ id, title, subTitle, writtenBy, file, tags, desc, slug }) => {
    try {
      let formdata = new FormData();
      formdata.append('title', title);
      formdata.append('file', file);
      formdata.append('subTitle', subTitle);
      formdata.append('writtenBy', writtenBy);
      formdata.append('tags', tags);
      formdata.append('desc', desc);
      formdata.append('slug', slug);

      const data = await putRequest(`${baseUrl}/charity/updateCharity/${id}`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCharity = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/charity/deleteCharity/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoCharity = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/charity/undoCharity/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllCharitys = async () => {
    try {
      const data = await deleteRequest(`${baseUrl}/charity/deleteAllCharitys`, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getCategorys = async (id, status, query, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/category/getCategorys?id=${id}&status=${status}&query=${query}&page=${page}&perPage=${perPage}`, false, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postCategory = async ({ title, file, subTitle, subTitle1, subTitle2, images, tags, imageDesc, desc, keyHighlights }) => {
    try {
      let formdata = new FormData();
      formdata.append('title', title);
      formdata.append('file', file);

      // for(let i of images)
      // {
      //   formdata.append('images', i);
      // }
      // formdata.append('subTitle', subTitle);
      // formdata.append('subTitle1', subTitle1);
      // formdata.append('subTitle2', subTitle2);
      // formdata.append('tags', JSON.stringify(tags));
      // formdata.append('imageDesc', JSON.stringify(imageDesc));
      // formdata.append('desc', desc);
      // formdata.append('keyHighlights', JSON.stringify(keyHighlights));

      const data = await postRequest(`${baseUrl}/category/postCategory`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateCategory = async ({ id, title, file, subTitle, subTitle1, subTitle2, prevImgArr, images, tags, imageDesc, desc, keyHighlights }) => {
    try {
      let formdata = new FormData();
      formdata.append('title', title);
      formdata.append('file', file);

      // for(let i of images)
      // {
      //   formdata.append('images', i);
      // }
      // formdata.append('subTitle', subTitle);
      // formdata.append('subTitle1', subTitle1);
      // formdata.append('subTitle2', subTitle2);
      // formdata.append('prevImgArr', JSON.stringify(prevImgArr));
      // formdata.append('tags', JSON.stringify(tags));
      // formdata.append('imageDesc', JSON.stringify(imageDesc));
      // formdata.append('desc', desc);
      // formdata.append('keyHighlights', JSON.stringify(keyHighlights));

      const data = await putRequest(`${baseUrl}/category/updateCategory/${id}`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategoryImage = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/category/deleteCategoryImage/${id.replaceAll('/', ':')}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/category/deleteCategory/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoCategory = async (id) => {
    try {
      const data = await putRequest(`${baseUrl}/category/undoCategory/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllCategorys = async () => {
    try {
      const data = await deleteRequest(`${baseUrl}/category/deleteAllCategorys`, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getContests = async (id, status, page, perPage, deleted, category, startDate, endDate, activeOnly, user) => {
    try {
      const data = await getRequest(`${baseUrl}/contest/getContests?id=${id}&status=${status}&page=${page}&perPage=${perPage}&deleted=${deleted}&category=${category}&startDate=${startDate}&endDate=${endDate}&activeOnly=${activeOnly}&user=${user}`, false, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postContest = async ({ title, img, startDate, endDate, winning, category }) => {
    try {
      let formdata = new FormData();
      formdata.append('title', title);
      formdata.append('startDate', startDate);
      formdata.append('endDate', endDate);
      formdata.append('winning', winning);
      formdata.append('category', category);

      formdata.append('file', img);
      const data = await postRequest(`${baseUrl}/contest/postContest`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const drawResults = async ({ id, events }) => {
    try {
      const data = await putRequest(`${baseUrl}/contest/drawResults/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateContest = async ({ id, title, img, startDate, endDate, winning, contestants, category }) => {
    try {
      let formdata = new FormData();
      formdata.append('title', title);
      formdata.append('startDate', startDate);
      formdata.append('endDate', endDate);
      formdata.append('winning', winning);
      formdata.append('contestants', contestants);
      formdata.append('category', category);

      formdata.append('file', img);
      const data = await putRequest(`${baseUrl}/contest/updateContest/${id}`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteContest = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/contest/deleteContest/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoContest = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/contest/undoContest/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllContests = async () => {
    try {
      const data = await deleteRequest(`${baseUrl}/contest/deleteAllContests`, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const signup = async ({ firstName, lastName, email, phone, password, address, file }) => {
    try {
      const formdata = new FormData();
      formdata.append('firstName', firstName);
      formdata.append('lastName', lastName);
      formdata.append('email', email);
      formdata.append('phone', phone);
      formdata.append('password', password);
      formdata.append('address', address);
      formdata.append('file', file);
      const data = await postRequest(`${baseUrl}/user/signin`, formdata, false, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const login = async ({ email, password }) => {
    try {
      const data = await postRequest(`${baseUrl}/user/login`, { email, password }, false, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const adminLogin = async ({ email, password }) => {
    try {
      const data = await postRequest(`${baseUrl}/user/adminLogin`, { email, password }, false, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = async ({ name, email, userName, phone, password, role, userPermissions, address, file }) => {
    try {
      const formdata = new FormData();
      formdata.append('name', name);
      formdata.append('email', email);
      formdata.append('userName', userName);
      formdata.append('phone', phone);
      formdata.append('password', password);
      formdata.append('role', role);
      formdata.append('userPermissions', JSON.stringify(userPermissions));
      formdata.append('address', address);
      formdata.append('file', file);
      const data = await postRequest(`${baseUrl}/user/createUser`, formdata, false, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async ({ _id, name, email, phone, userName }) => {
    try {
      const data = await putRequest(`${baseUrl}/user/updateUser/${_id}`, { name, email, phone, userName }, false, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserStatus = async ({ _id, status }) => {
    try {
      const data = await putRequest(`${baseUrl}/user/updateUserStatus/${_id}`, { status }, false, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/user/deleteUser/${id}`, {}, false, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getNewsLetters = async (status, query, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/newsLetter/getNewsLetters?status=${status}&query=${query}&page=${page}&perPage=${perPage}`, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getContacts = async (status, query, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/contact/getContacts?status=${status}&query=${query}&page=${page}&perPage=${perPage}`, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postReply = async ({ _id, reply, email, name }) => {
    try {
      const data = await putRequest(`${baseUrl}/contact/postReply/${_id}`, { reply, email, name }, false, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteContact = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/contact/deleteContact/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async (status, role, query, page, perPage, user, contest, subscription) => {
    try {
      const data = await getRequest(`${baseUrl}/user/getUsers?status=${status}&role=${role}&query=${query}&page=${page}&perPage=${perPage}&user=${user}&contest=${contest}&subscription=${subscription}`, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getPayments = async (status, query, page, perPage, user, startDate, endDate) => {
    try {
      const data = await getRequest(`${baseUrl}/payment/getPayments?status=${status}&query=${query}&page=${page}&perPage=${perPage}&user=${user}&startDate=${startDate}&endDate=${endDate}`, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deletePayment = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/payment/deletePayment/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async ({ file }) => {
    try {
      let formdata = new FormData();
      formdata.append('file', file);

      const data = await postRequest(`${baseUrl}/util/uploadImage`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoFaq = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/faq/undoFaq/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getFaqs = async (status, query, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/faq/getFaqs?status=${status}&query=${query}&page=${page}&perPage=${perPage}`, false, props);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postFaq = async ({ question, answer }) => {
    try {
      const data = await postRequest(`${baseUrl}/faq/postFaq`, { question, answer }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateFaq = async ({ id, question, answer }) => {
    try {
      const data = await putRequest(`${baseUrl}/faq/updateFaq/${id}`, { question, answer }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFaq = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/faq/deleteFaq/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoMedia = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/media/undoMedia/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getMedias = async (status, query, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/media/getMedias?status=${status}&query=${query}&page=${page}&perPage=${perPage}`, false, props);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postMedia = async ({ url }) => {
    try {
      const data = await postRequest(`${baseUrl}/media/postMedia`, { url }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMedia = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/media/deleteMedia/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoGiftCard = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/giftCard/undoGiftCard/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getGiftCards = async (status, query, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/giftCard/getGiftCards?status=${status}&query=${query}&page=${page}&perPage=${perPage}`, false, props);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postGiftCard = async ({ User, Subscription }) => {
    try {
      const data = await postRequest(`${baseUrl}/giftCard/postGiftCard`, { User, Subscription }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateGiftCard = async ({ id, User, isAvailed }) => {
    try {
      const data = await putRequest(`${baseUrl}/giftCard/updateGiftCard/${id}`, { User, isAvailed }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteGiftCard = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/giftCard/deleteGiftCard/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getSubscriptions = async (status, query, type, subType, page, perPage, id) => {
    try {
      const data = await getRequest(`${baseUrl}/subscription/getSubscriptions?status=${status}&query=${query}&type=${type}&subType=${subType}&page=${page}&perPage=${perPage}&id=${id}`, false, props);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postSubscription = async ({ title, subtitle, desc, desc1, desc2, desc3, starPointsOffered, amount, discount, type, subType, tier }) => {
    try {
      const data = await postRequest(`${baseUrl}/subscription/postSubscription`, { title, subtitle, desc, desc1, desc2, desc3, starPointsOffered, amount, discount, type, subType, tier }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateSubscription = async ({ id, title, subtitle, desc, desc1, desc2, desc3, starPointsOffered, amount, discount, type, subType, tier }) => {
    try {
      const data = await putRequest(`${baseUrl}/subscription/updateSubscription/${id}`, { title, subtitle, desc, desc1, desc2, desc3, starPointsOffered, amount, discount, type, subType, tier }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoSubscription = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/subscription/undoSubscription/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSubscription = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/subscription/deleteSubscription/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getCoupans = async (status, query, page, perPage, userId, prizeWon, event) => {
    try {
      const data = await getRequest(`${baseUrl}/coupan/getCoupans?status=${status}&query=${query}&page=${page}&perPage=${perPage}&userId=${userId}&prizeWon=${prizeWon}&event=${event}`, false, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postCoupan = async ({ prizeWon, offer, expiryDate, startDate, subscription }) => {
    try {
      const data = await postRequest(`${baseUrl}/coupan/postCoupan`, { prizeWon, offer, expiryDate, startDate, subscription }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postCoupanBulk = async ({ coupanCount, expiryDate, startDate, offer, subscription, prizeWonCount }) => {
    try {
      const data = await postRequest(`${baseUrl}/coupan/postCoupanBulk`, { coupanCount, expiryDate, startDate, offer, subscription, prizeWonCount }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const assignCoupansToUser = async ({ subscription }) => {
    try {
      const data = await postRequest(`${baseUrl}/coupan/assignCoupansToUser`, { subscription }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateCoupan = async ({ id, prizeWon, offer, expiryDate, startDate, subscription, revealed }) => {
    try {
      const data = await putRequest(`${baseUrl}/coupan/updateCoupan/${id}`, { prizeWon, offer, expiryDate, startDate, subscription, revealed }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const revealCoupan = async ({ id, revealed }) => {
    try {
      const data = await putRequest(`${baseUrl}/coupan/revealCoupan/${id}`, { revealed }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoCoupan = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/coupan/undoCoupan/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCoupan = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/coupan/deleteCoupan/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getTermss = async () => {
    try {
      const data = await getRequest(`${baseUrl}/terms/getTermss`, false, props);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postTerms = async ({ desc }) => {
    try {
      const data = await postRequest(`${baseUrl}/terms/postTerms`, { desc }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateTerms = async ({ id, desc }) => {
    try {
      const data = await putRequest(`${baseUrl}/terms/updateTerms/${id}`, { desc }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getRuless = async () => {
    try {
      const data = await getRequest(`${baseUrl}/rule/getRules`, false, props);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postRules = async ({ desc }) => {
    try {
      const data = await postRequest(`${baseUrl}/rule/postRule`, { desc }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateRules = async ({ id, desc }) => {
    try {
      const data = await putRequest(`${baseUrl}/rule/updateRule/${id}`, { desc }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getThemeControls = async () => {
    try {
      const data = await getRequest(`${baseUrl}/theme/getThemes`, false, props);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postThemeControls = async ({ colorCode }) => {
    try {
      const data = await postRequest(`${baseUrl}/theme/postTheme`, { colorCode }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateThemeControls = async ({ id, colorCode }) => {
    try {
      const data = await putRequest(`${baseUrl}/theme/updateTheme/${id}`, { colorCode }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getPrivacys = async () => {
    try {
      const data = await getRequest(`${baseUrl}/privacy/getPrivacys`, false, props);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postPrivacy = async ({ desc }) => {
    try {
      const data = await postRequest(`${baseUrl}/privacy/postPrivacy`, { desc }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updatePrivacy = async ({ id, desc }) => {
    try {
      const data = await putRequest(`${baseUrl}/privacy/updatePrivacy/${id}`, { desc }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getDashboardData = async () => {
    try {
      const data = await getRequest(`${baseUrl}/dashboard-data`, false, props);
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getStatisticss = async () => {
    try {
      const data = await getRequest(`${baseUrl}/statistics/getStatisticss`, false, props);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postStatistics = async ({ count1, count2, count3, count4 }) => {
    try {
      const data = await postRequest(`${baseUrl}/statistics/postStatistics`, { count1, count2, count3, count4 }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatistics = async ({ id, count1, count2, count3, count4 }) => {
    try {
      const data = await putRequest(`${baseUrl}/statistics/updateStatistics/${id}`, { count1, count2, count3, count4 }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getVideos = async (id, category, contest, isActive, user, status, query, activeFlag, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/video/getVideos?id=${id}&category=${category}&contest=${contest}&isActive=${isActive}&user=${user}&status=${status}&query=${query}&page=${page}&activeFlag=${activeFlag}&perPage=${perPage}`, false, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postVideo = async ({ caption, category, contest, regionCountry, regionState, file }) => {
    try {
      let formdata = new FormData();
      formdata.append('caption', caption);
      formdata.append('category', category);
      formdata.append('contest', contest);
      formdata.append('regionCountry', JSON.stringify(regionCountry));
      formdata.append('regionState', JSON.stringify(regionState));
      formdata.append('file', file);
      const data = await postRequest(`${baseUrl}/video/postVideo`, formdata, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateVideo = async ({ id, caption, category, contest, regionCountry, regionState, isActive }) => {
    try {
      let formdata = new FormData();
      formdata.append('caption', caption);
      formdata.append('category', category);
      formdata.append('contest', contest);
      formdata.append('regionCountry', JSON.stringify(regionCountry));
      formdata.append('regionState', JSON.stringify(regionState));
      formdata.append('isActive', JSON.stringify(isActive));
      formdata.append('file', file);
      const data = await putRequest(`${baseUrl}/video/updateVideo/${id}`, formdata, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoVideo = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/video/undoVideo/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteVideo = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/video/deleteVideo/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getComment = async (id, video, user, status, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/comment/getComments?status=${status}&id=${id}&video=${video}&user=${user}&page=${page}&perPage=${perPage}`, false, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postComment = async ({ video, text }) => {
    try {
      const data = await postRequest(`${baseUrl}/comment/postComment`, { video, text }, true, props, true);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateComment = async ({ id, text, likes }) => {
    try {
      const data = await putRequest(`${baseUrl}/comment/updateComment/${id}`, { likes, text }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoComment = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/comment/undoComment/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/comment/deleteComment/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getReplys = async (id, comment, video, user, status, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/reply/getReplys?status=${status}&id=${id}&comment=${comment}&video=${video}&user=${user}&page=${page}&perPage=${perPage}`, false, props);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postReply1 = async ({ comment, video, text, parent, parentUser }) => {
    try {
      const data = await postRequest(`${baseUrl}/reply/postReply`, { comment, video, text, parent, parentUser }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateReply = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/reply/updateReply/${id}`, { title, subtitle, desc, coupanOffered, type, period, amount, discount }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoReply = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/reply/undoReply/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteReply = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/reply/deleteReply/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getRewardPools = async (contest) => {
    try {
      const data = await getRequest(`${baseUrl}/rewardPool/getRewardPools?contest=${contest}`, false, props);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postRewardPool = async ({ contest, rewards, countryRewards, stateRewards }) => {
    try {
      const data = await postRequest(`${baseUrl}/rewardPool/postRewardPool`, { contest, rewards, countryRewards, stateRewards }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateRewardPool = async ({ id, rewards, countryRewards, stateRewards }) => {
    try {
      const data = await putRequest(`${baseUrl}/rewardPool/updateRewardPool/${id}`, { rewards, countryRewards, stateRewards }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoRewardPool = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/rewardPool/undoRewardPool/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRewardPool = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/rewardPool/deleteRewardPool/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getNotifications = async (id, type, user, status, page, perPage) => {
    try {
      const data = await getRequest(`${baseUrl}/notification/getNotifications?status=${status}&id=${id}&perPage=${perPage}&page=${page}&user=${user}&type=${type}`, false, props);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postNotification = async ({ type, video, text, userReceiver }) => {
    try {
      const data = await postRequest(`${baseUrl}/notification/postNotification`, { type, video, text, userReceiver }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateNotification = async ({ id, status }) => {
    try {
      const data = await putRequest(`${baseUrl}/notification/updateNotification/${id}`, { status }, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const undoNotification = async ({ id }) => {
    try {
      const data = await putRequest(`${baseUrl}/notification/undoNotification/${id}`, {}, true, props, false);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const data = await deleteRequest(`${baseUrl}/notification/deleteNotification/${id}`, {}, true, props);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainContext.Provider value={{ getBlogs, postBlog, updateBlog, deleteBlog, deleteAllBlogs, getContacts, deleteContact, signup, login, adminLogin, getUsers, createUser, updateUser, updateUserStatus, uploadImage, undoBlog, getFaqs, postFaq, updateFaq, deleteFaq, getTermss, postTerms, updateTerms, postReply, undoFaq, getPrivacys, postPrivacy, updatePrivacy, getSubscriptions, postSubscription, updateSubscription, undoSubscription, deleteSubscription, getCoupans, postCoupan, postCoupanBulk, assignCoupansToUser, updateCoupan, revealCoupan, undoCoupan, deleteCoupan, getPayments, getThemeControls, postThemeControls, updateThemeControls, deletePayment, getDashboardData, getCategorys, postCategory, updateCategory, deleteCategoryImage, deleteCategory, deleteAllCategorys, getContests, postContest, drawResults, updateContest, deleteContest, deleteAllContests, getCareers, postCareer, updateCareer, deleteCareer, deleteAllCareers, getPartners, postPartner, updatePartner, deletePartner, deleteAllPartners, getCharitys, postCharity, updateCharity, deleteCharity, deleteAllCharitys, getRuless, postRules, updateRules, undoGiftCard, getGiftCards, postGiftCard, updateGiftCard, deleteGiftCard, getNewsLetters, undoContest, undoCareer, undoPartner, undoCharity, undoCategory, undoMedia, getMedias, postMedia, deleteMedia, getTestimonials, postTestimonial, undoTestimonial, deleteTestimonial, updateTestimonial, deleteAllTestimonials, getStatisticss, postStatistics, updateStatistics, getVideos, postVideo, updateVideo, undoVideo, deleteVideo, getComment, postComment, updateComment, undoComment, deleteComment, getReplys, postReply1, updateReply, undoReply, deleteReply, getNotifications, postNotification, updateNotification, undoNotification, deleteNotification, deleteUser, getAbouts, postAbout, updateAbout, deleteAbout, undoAbout, deleteAllAbouts, getRewardPools, postRewardPool, updateRewardPool, undoRewardPool, deleteRewardPool }}>
      {props.children}
    </MainContext.Provider>
  );
};

export default MainState;
