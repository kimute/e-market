"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useActionState, useState } from "react";
import uploadProduct, { getUploadUrl } from "./actions";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [fileError, setFileError] = useState("");
  // upload to cloudflare
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setImageId] = useState("");

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;

    if (!files) {
      return;
    }

    const file = files[0];

    // 1. 파일이 선택되었는지 체크
    if (!file) {
      setFileError("파일을 선택해주세요.");
      return;
    }

    // 2. 파일 크기 체크 (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setFileError("파일 크기는 5MB 이하여야 합니다.");
      setPreview(""); // 미리보기 초기화
      return;
    }

    // 에러 초기화
    setFileError("");

    // preview image 생성
    // 파일을 browser의 메모리에 저장하고 그 메모리의 주소를 반환
    const url = URL.createObjectURL(file);
    setPreview(url);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setImageId(id);
    }
  };

  const interceptAction = async (_: any, formData: FormData) => {
    const file = formData.get("photo");
    if (!file) {
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const res = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });

    if (!res.ok) {
      console.error("Cloudflare upload failed:", res.status);
      return;
    }

    const uploadResult = await res.json();
    console.log("Upload result:", uploadResult);

    // image delivery url 을 폼데이터에 추가
    const imageDeliveryURL = `https://imagedelivery.net/F6a5dMtXerowSsyLTfyxdg/${photoId}/public`;
    console.log("imageDeliveryURL:", imageDeliveryURL);
    formData.set("photo", imageDeliveryURL);
    return uploadProduct(formData);
  };
  const [state, dispatch] = useActionState(interceptAction, null);
  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square bg-center bg-cover border-gray-300 border-dashed rounded-md p-10 cursor-pointer flex flex-col items-center justify-center gap-2"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          <>
            {preview ? null : (
              <>
                <PhotoIcon className="w-20" />
                <div>Add your Photo</div>
                {}
              </>
            )}
          </>
        </label>
        <Input
          type="file"
          name="photo"
          id="photo"
          placeholder="photo"
          accept="image/*"
          className="hidden"
          onChange={onImageChange}
        />
        {fileError && <span className="text-red-500 text-sm">{fileError}</span>}

        <Input
          type="text"
          name="title"
          placeholder="title"
          errors={state?.error?.title}
        />
        <Input
          type="number"
          name="price"
          placeholder="price"
          errors={state?.error?.price}
        />
        <Input
          type="text"
          name="description"
          placeholder="description"
          errors={state?.error?.description}
        />

        <Button text="Add Product" />
      </form>
    </div>
  );
}
