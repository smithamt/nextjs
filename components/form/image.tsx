import axios from "@/constants/app/axios";
import Image from "next/image";
import { ChangeEvent, FC, useRef, useState } from "react";
import { MdAddToPhotos } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

interface MediaProps {
  image: string;
  setImage: (images: string) => void;
  title: string;
}

const AddMedia: FC<MediaProps> = ({ image, setImage, title }) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setUploading(true);
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);

      const response = await axios.post("/api/images", formData);
      if (inputRef && inputRef.current) {
        inputRef.current.value = "";
      }
      setImage(response.data?._id);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      const response = await axios.delete(`/api/images/${id}`);
      console.log("response.data", response.data);
      if (response.data) setImage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="cart-bg rounded-md p-4">
      <input
        onChange={onChange}
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
      />
      {image && (
        <div className="flex items-center justify-between p-2 rounded-md px-4 mb-2">
          <Image
            width={50}
            height={50}
            src={`/api/images/${image}/50/50`}
            alt="image preview"
          />
          <div
            onClick={() => onDelete(image)}
            className="w-10 h-10 border rounded-sm center hover"
          >
            <RiDeleteBinLine size={20} />
          </div>
        </div>
      )}
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
