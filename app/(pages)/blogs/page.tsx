"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Toaster, toast } from 'sonner';
import { apiService } from "@/apies/Services/UserService";
import CommonListV3 from "@/components/(AdminPanel)/ListOfDatawithPagination/CommonListV3";
import Popup from "@/components/(AdminPanel)/popup";
import { useAuthRedirect } from "@/utilities/Authentication";
import Link from "next/link";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});
import 'react-quill/dist/quill.snow.css';
import Image from "next/image";

interface IBlogFormValues {
  blogId?: string;
  id?: string;
  guid: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  content: string;
  alterText: string;
  internalKeywords: string;
  imageUrl: string;
  imageFile?: File | null;
  imageTitle: string;
  imageDescription: string;
  imageCaption: string;
  category: string;
  tags: string[];
  focusKeyword: string;
  authorName: string;
  authorImage: string;
  isPublished: boolean;
  publishedAt?: Date | null;
  views: number;
  likes: number;
}

interface Blog {
  blogId: string;
  id: string;
  guid: string;
  title: string;
  slug: string;
  metaTitle: string;
  isPublished: boolean;
  publishedAt?: string;
  authorName: string;
  views: number;
  likes: number;
  imageUrl: string;
}

const BlogSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  slug: Yup.string().required('Slug is required'),
  metaTitle: Yup.string().required('Meta title is required'),
  content: Yup.string().required('Content is required'),
  authorName: Yup.string().required('Author name is required'),
});

const RichTextEditor = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  return (
    <div className="bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder="Write your blog content here..."
        className="h-[300px] mb-4"
      />
    </div>
  );
};

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Blog[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [initialValues, setInitialValues] = useState<IBlogFormValues>({
    title: '',
    slug: '',
    guid: '',
    metaTitle: '',
    metaDescription: '',
    summary: '',
    content: '',
    alterText: '',
    internalKeywords: '',
    imageUrl: '',
    imageFile: null,
    imageTitle: '',
    imageDescription: '',
    imageCaption: '',
    category: '',
    tags: [],
    focusKeyword: '',
    authorName: 'FlexeMarket',
    authorImage: '',
    isPublished: false,
    publishedAt: null,
    views: 0,
    likes: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiService.fetchData("/blogs", {}, true);
      setData(response.data);
    } catch (err) {
      toast.error("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = async (id: string) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (!selectedId) return;
      const response = await apiService.deleteData("/blogs", selectedId);
      if (response.isSuccess) {
        toast.success("Blog deleted successfully");
        setRefreshKey(prev => prev + 1);
        fetchData();
      }
    } catch (error) {
      toast.error("Error deleting blog");
    }
  };

  const handleEdit = (id: string, blogData: any) => {
    setSelectedId(id);
    setIsEditing(true);
    setImagePreview("https://flexemart.com/uploads/"+blogData.imageUrl || null);
    setInitialValues({
      ...blogData,
      publishedAt: blogData.publishedAt ? new Date(blogData.publishedAt) : null,
      category: blogData.category || '',
      tags: blogData.tags || [],
      imageFile: null
    });
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFieldValue("imageFile", file);
      setFieldValue("imageUrl", ""); // Clear URL field when uploading file
    }
  };

  const handleSubmit = async (values: IBlogFormValues, { resetForm }: { resetForm: () => void }) => {
    setLoading(true);
    
    try {
      let imageUrl = values.imageUrl;
      
      // Upload new image if selected
      if (values.imageFile) {
        const formData = new FormData();
        formData.append('file', values.imageFile);
        
        const uploadResponse = await apiService.postData(
          '/Media/upload-blog-image',
          formData,
          { 'Content-Type': 'multipart/form-data' },
          true,
          true
        );
          values.imageUrl = uploadResponse; 

        if (uploadResponse !== null ) {
          imageUrl = uploadResponse; 
        }
      }

      const payload = {
        ...values,
        publishedAt: values.isPublished ? (values.publishedAt || new Date()).toISOString() : null
      };

      if (isEditing && selectedId) {
        const response = await apiService.putData(`/blogs/${selectedId}`, payload, {}, true);
        if (response.isSuccess) {
          toast.success("Blog updated successfully");
          resetForm();
          setIsEditing(false);
          setImagePreview(null);
          fetchData();
        }
      } else {
        const response = await apiService.postData("/blogs", payload, {}, true);
        if (response.isSuccess) {
          toast.success("Blog created successfully");
          resetForm();
          setImagePreview(null);
          fetchData();
        }
      }
    } catch (err) {
      toast.error("Error saving blog");
    } finally {
      setLoading(false);
    }
  };

  if (useAuthRedirect()) return null;

  return (
    <div className="w-full p-4">
      <Toaster />
      <Popup 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        title="Are you sure you want to delete this blog?" 
        cancelText="Cancel" 
        confirmText="Delete" 
        onConfirm={handleDelete} 
      />
    
      <h2 className="text-2xl font-bold mb-6">Blog Management</h2>
      
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Blog Form */}
        <div className="w-full xl:w-2/5 bg-white p-6 rounded-lg shadow">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={BlogSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values, handleBlur }) => (
              <Form className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Basic Information</h3>
                  
                  <div>
                    <label htmlFor="title" className="block font-medium mb-1">Title*</label>
                    <Field
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Enter the blog post title"
                      className="border rounded w-full p-2"
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        handleBlur(e);
                        if (!values.slug) {
                          setFieldValue('slug', generateSlug(e.target.value));
                        }
                        if (!values.metaTitle) {
                          setFieldValue('metaTitle', e.target.value);
                        }
                      }}
                    />
                    <ErrorMessage name="title" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="slug" className="block font-medium mb-1">Slug*</label>
                    <Field
                      type="text"
                      id="slug"
                      name="slug"
                      placeholder="URL-friendly slug (auto-generated)"
                      className="border rounded w-full p-2"
                    />
                    <ErrorMessage name="slug" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">SEO Settings</h3>
                  
                  <div>
                    <label htmlFor="metaTitle" className="block font-medium mb-1">Meta Title*</label>
                    <Field
                      type="text"
                      id="metaTitle"
                      name="metaTitle"
                      placeholder="Title for search engines (60 characters max)"
                      className="border rounded w-full p-2"
                    />
                    <ErrorMessage name="metaTitle" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="metaDescription" className="block font-medium mb-1">Meta Description</label>
                    <Field
                      as="textarea"
                      id="metaDescription"
                      name="metaDescription"
                      rows={3}
                      placeholder="Description for search results (160 characters max)"
                      className="border rounded w-full p-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="focusKeyword" className="block font-medium mb-1">Focus Keyword</label>
                    <Field
                      type="text"
                      id="focusKeyword"
                      name="focusKeyword"
                      placeholder="Primary keyword for SEO optimization"
                      className="border rounded w-full p-2"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-6 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Content</h3>
                  
                  <div className="h-96">
                    <label htmlFor="content" className="block font-medium mb-1">Content*</label>
                    <RichTextEditor
                      value={values.content}
                      onChange={(content) => setFieldValue('content', content)}
                    />
                    <ErrorMessage name="content" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                </div>

                {/* Featured Image */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Featured Image</h3>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setFieldValue)}
                    className="hidden"
                  />
                  
                  {/* Image Preview */}
                  {(imagePreview || values.imageUrl) && (
                    <div className="mb-4">
                      <img 
                        src={imagePreview || values.imageUrl} 
                        alt="Preview" 
                        className="max-h-60 object-contain rounded border"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded"
                  >
                    {imagePreview || values.imageUrl ? 'Change Image' : 'Upload Image'}
                  </button>

                  {!imagePreview && (
                    <div className="mt-4">
                      <label htmlFor="imageUrl" className="block font-medium mb-1">Or enter image URL</label>
                      <Field
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        placeholder="https://example.com/image.jpg"
                        className="border rounded w-full p-2"
                      />
                    </div>
                  )}

                  <div className="mt-4">
                    <label htmlFor="alterText" className="block font-medium mb-1">Alt Text</label>
                    <Field
                      type="text"
                      id="alterText"
                      name="alterText"
                      placeholder="Description for screen readers and SEO"
                      className="border rounded w-full p-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="imageTitle" className="block font-medium mb-1">Image Title</label>
                    <Field
                      type="text"
                      id="imageTitle"
                      name="imageTitle"
                      placeholder="Title attribute for the image"
                      className="border rounded w-full p-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="imageCaption" className="block font-medium mb-1">Image Caption</label>
                    <Field
                      type="text"
                      id="imageCaption"
                      name="imageCaption"
                      placeholder="Caption to display below the image"
                      className="border rounded w-full p-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="imageDescription" className="block font-medium mb-1">Image Description</label>
                    <Field
                      as="textarea"
                      id="imageDescription"
                      name="imageDescription"
                      placeholder="Detailed description of the image"
                      className="border rounded w-full p-2"
                    />
                  </div>
                </div>

                {/* Organization */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Organization</h3>
                  
                  <div>
                    <label htmlFor="category" className="block font-medium mb-1">Category</label>
                    <Field
                      type="text"
                      id="category"
                      name="category"
                      placeholder="Enter category (e.g., Technology, Business)"
                      className="border rounded w-full p-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="tags" className="block font-medium mb-1">Tags</label>
                    <Field
                      type="text"
                      id="tags"
                      name="tags"
                      placeholder="Comma-separated tags (e.g., SEO, Marketing, 2023)"
                      className="border rounded w-full p-2"
                      value={values.tags.join(', ')}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const tags = e.target.value.split(',').map(item => item.trim());
                        setFieldValue('tags', tags);
                      }}
                    />
                  </div>
                </div>

                {/* Author & Publishing */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Author & Publishing</h3>
                  
                  <div>
                    <label htmlFor="authorName" className="block font-medium mb-1">Author Name*</label>
                    <Field
                      type="text"
                      id="authorName"
                      name="authorName"
                      placeholder="Name of the author"
                      className="border rounded w-full p-2"
                    />
                    <ErrorMessage name="authorName" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        id="isPublished"
                        name="isPublished"
                        className="mr-2"
                      />
                      <label htmlFor="isPublished" className="font-medium">Publish this post</label>
                    </div>

                    {values.isPublished && (
                      <div className="flex-1">
                        <label htmlFor="publishedAt" className="block font-medium mb-1">Publish Date/Time</label>
                        <DatePicker
                          selected={values.publishedAt}
                          onChange={(date) => setFieldValue('publishedAt', date)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          placeholderText="Select publish date and time"
                          className="border rounded w-full p-2"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full font-medium"
                >
                  {loading ? "Processing..." : isEditing ? "Update Blog Post" : "Create Blog Post"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Blog List */}
        <div className="w-full xl:w-3/5">
          <CommonListV3<Blog>
            key={refreshKey}
            apiEndpoint=""
             sharedList={data}
            columns={[
              { 
                key: "title", 
                label: "Title",
                render: (title: string, item: Blog) => (
                  <div className="flex flex-col">
                    <Link href={`/blog/${item.slug}`} target="_blank" className="text-blue-600 hover:underline font-medium">
                      {title}
                    </Link>
                    <span className="text-sm text-gray-500">{item.metaTitle}</span>
                  </div>
                )
              },
              { 
                key: "imageUrl", 
                label: "Image",
                render: (imageUrl: string) => (
                  imageUrl ? (
                    // <img 
                    //   src={imageUrl} 
                    //   alt="Blog thumbnail" 
                    //   className="w-16 h-16 object-cover rounded"
                    // />

                        <Image
                                          width={100}
                                          height={100}
                                            src={`https://flexemart.com/uploads/${
                                              imageUrl
                                            }`}
                                            alt="Blog Image"
                                            className="w-16 h-16 object-cover"
                                          />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )
                )
              },
              { 
                key: "authorName", 
                label: "Author" 
              },
              { 
                key: "isPublished", 
                label: "Status",
                render: (isPublished: boolean) => (
                  <span className={`px-2 py-1 rounded text-xs ${isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {isPublished ? 'Published' : 'Draft'}
                  </span>
                )
              },
              { 
                key: "views", 
                label: "Views",
                render: (views: number) => (
                  <span className="text-center block">{views}</span>
                )
              },
              { 
                key: "likes", 
                label: "Likes",
                render: (likes: number) => (
                  <span className="text-center block">{likes}</span>
                )
              },
              { 
                key: "publishedAt", 
                label: "Published At",
                render: (publishedAt: string) => (
                  <span className="text-sm text-gray-500">
                    {publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Not Published'}
                  </span>
                )
              }
            ]}
            onEdit={handleEdit}
            onDelete={handleDeleteConfirmation}
            filtersPatterns={[
              { name: "title", type: "text", placeholder: "Search by title" },
              { name: "authorName", type: "text", placeholder: "Search by author" },
              { 
                name: "isPublished", 
                type: "select", 
                options: [
                  { key: "All", value: "" },
                  { key: "Published", value: "true" },
                  { key: "Drafts", value: "false" }
                ] 
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;