import axios from "@/constants/app/axios";
import Image from "next/image";
import { ChangeEvent, FC, useRef, useState } from "react";
import { MdAddToPhotos } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

interface MediaProps {
  images: any[];
  setImages: (images: string[]) => void;
  title: string;
  description?: string;
}

const AddMedia: FC<MediaProps> = ({
  images,
  setImages,
  title,
  description,
}) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setUploading(true);
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("myImage", file);

      const postUrl = `/api/images/notification/creating-notification`;
      const response = await axios.post(postUrl, formData);
      if (inputRef && inputRef.current) {
        inputRef.current.value = "";
      }
      setImages([...images, response.data._id]);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `/api/images/notification/creating-notification/${id}`
      );
      console.log("response.data", response.data);
      if (response.data) setImages(images.filter((p) => p !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="cart-bg rounded-md p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{title}</p>
        {description && <p className="text-xs inactive-text">{description}</p>}
      </div>
      <div className="h-2"></div>
      <input
        onChange={onChange}
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
      />
      {images.map((i, k) => {
        return (
          <div
            className="flex items-center justify-between p-2 rounded-md px-4 mb-2"
            key={k}
          >
            <Image
              className="object-cover"
              width={50}
              height={50}
              src={`/api/images/${i}/50/50`}
              alt="image preview"
            />
            <div
              onClick={() => onDelete(i)}
              className="w-10 h-10 border rounded-sm center hover"
            >
              <RiDeleteBinLine size={20} />
            </div>
          </div>
        );
      })}
      <button
        onClick={() => inputRef.current?.click()}
        type="button"
        className="flex border px-4 py-2 rounded-sm hover:bg-black/5"
      >
        <MdAddToPhotos size={20} />
        <p className="px-2">Add Photo</p>
      </button>
    </div>
  );
};

export default AddMedia;
