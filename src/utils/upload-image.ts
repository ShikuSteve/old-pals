import { cloudName } from "../backend/services/upload-image";

export const uploadImage = async (
  file: File
): Promise<string | null | undefined> => {
  if (!file) return null;

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "OldPals");
  data.append("cloud_name", cloudName);

  try {
    const response = await fetch(
      `      https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: data }
    );

    const result = await response.json();
    // console.log("Upload success:", result);
    return result.secure_url; // Cloudinary URL of the uploaded image
  } catch (err) {
    console.log(err);
    return;
  }
};
