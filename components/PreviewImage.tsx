import { cn, getFileIcon } from "@/lib/utils";
import Image from "next/image";
interface Props {
  extension: string;
  type: string;
  imageClassName?: string;
  className?: string;
  url?: string;
}

const PreviewImage = ({
  extension,
  type,
  imageClassName,
  className,
  url = "",
}: Props) => {
  const isImage = type === "image" && extension !== "svg";

  return (
    <figure
      className={cn(
        ` size-[50px] min-w-[50px] overflow-hidden rounded-full bg-brand/10`,
        className
      )}
    >
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="imagePreview"
        width={100}
        height={100}
        className={cn(
          "size-8 , object-contain",
          imageClassName,
          isImage && "size-full object-cover object-center"
        )}
      />
    </figure>
  );
};

export default PreviewImage;
