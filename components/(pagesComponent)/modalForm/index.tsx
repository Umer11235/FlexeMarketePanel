"use client";
import React, { useEffect, useState } from "react";
import Image from 'next/image'; // Import next/image

interface Field {
  label: string;
  name: string;
  type?: string;
}

interface ModalFormProps {
  isModalOpen: boolean;
  setisModalOpen: (val: boolean) => void;
  initialValues?: { [key: string]: any };
  fields: Field[];
  onSubmit: (values: any) => void;
  title?: string;
  withImageUpload?: boolean;
}

const ModalForm: React.FC<ModalFormProps> = ({
  isModalOpen,
  setisModalOpen,
  initialValues = {},
  fields,
  onSubmit,
  title,
  withImageUpload = false,
}) => {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    setFormValues(initialValues || {});
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
    setisModalOpen(false);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-2xl mx-4 md:mx-auto rounded-xl p-4 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title || "Form"}</h2>
          <button onClick={() => setisModalOpen(false)}>✖</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block font-medium mb-1">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formValues[field.name] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formValues[field.name] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              )}
            </div>
          ))}

          {/* Display images if available */}
          {initialValues?.images?.length > 0 && (
            <div>
              <label className="block font-medium mb-1">Existing Images</label>
              <div className="flex gap-4 flex-wrap">
                {initialValues.images.map((image: any, index: number) => (
                  <div key={index} className="w-24 h-24">
                    {/* Use Image component from Next.js */}
                    <Image
                   src={`https://flexemart.com/uploads/${image.name}`}
                        alt={`image-${index}`}
                      width={96} // Set width and height
                      height={96}
                      className="object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image upload input */}
          {withImageUpload && (
            <div>
              <label className="block font-medium mb-1">Upload Image</label>
              <input
                type="file"
                name="image"
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    image: e.target.files?.[0],
                  }))
                }
              />
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setisModalOpen(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
