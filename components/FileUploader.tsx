"use client";
import { Fragment, MouseEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import Image from "next/image";
import { getFileTypeAndExtension } from "@/lib/utils";
import PreviewImage from "./PreviewImage";
import { Separator } from "./ui/separator";
import { MAX_FILE_SIZE } from "@/constants";
import { toast } from "sonner";
import { uploadFile } from "@/lib/file.action";
import { usePathname } from "next/navigation";

const FileUploader = ({
  ownerId,
  accountId,
}: {
  ownerId: string;
  accountId: string;
  className?: string;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const path = usePathname();

  console.log("accountId: " + accountId + " " + ownerId);
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadFilePromises = acceptedFiles.map(async (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((pre) => pre.filter((f) => f.name !== file.name));

          return toast("Event has been created", {
            description: (
              <p className=" font-medium text-white">
                <span className="font-semibold">{file.name}</span> is too large.
                Max file size is 50MB.
              </p>
            ),
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
            className: "bg-red !rounded-[10px]",
          });
        }

        return uploadFile({ ownerId, accountId, file, path }).then(
          (uploadedFile) => {
            console.log(uploadedFile);
            if (uploadedFile) {
              setFiles((pre) =>
                pre.filter((f) => f.name !== uploadedFile.name)
              );
            }
          }
        );
      });
      await Promise.all(uploadFilePromises);
    },
    [accountId, ownerId, path]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <div {...getRootProps()} className=" cursor-pointer">
        <input {...getInputProps()} />
        <Button
          type="button"
          className="flex text-xl gap-2 font-bold  text-black  w-full items-center grow-[1] justify-center px-[30px] h-[54px] rounded-full hover:bg-sky-500 shadow-indigo-500 bg-indigo-500 transition-all duration-150 hover:text-black  hover:shadow-blue-500 shadow-sm"
        >
          <Image
            src="/assets/icons/upload.svg"
            alt="upload"
            width={24}
            height={24}
          />{" "}
          <p>Upload</p>
        </Button>
      </div>{" "}
      {files.length > 0 && (
        <ul className=" fixed right-10 bottom-5 bg-[#1a1e40] z-50 flex flex-col size-full h-fit max-w-[450px] rounded-lg p-7 gap-y-3 border-rose-50 border border-opacity-40">
          <h3 className=" font-semibold text-white mb-3 ">Uploading...</h3>

          {files.map((file, index) => {
            const { type, extension } = getFileTypeAndExtension(file.name);
            function handleRemoveFile(
              e: MouseEvent<HTMLImageElement, MouseEvent>,
              name: string
            ): void {
              e.preventDefault();
              setFiles((pre) => pre.filter((file) => file.name !== name));
            }

            return (
              <Fragment key={`${file.name}-${index}`}>
                <li className="flex justify-between items-center">
                  <div className=" flex items-center gap-5">
                    <PreviewImage
                      url={URL.createObjectURL(file)}
                      type={type}
                      className=" border border-sky-400"
                      extension={extension}
                    />

                    <div className="mb-2 line-clamp-1 max-w-[300px]">
                      <p className=" mb-1 text-slate-400">{file.name}</p>
                      <Image
                        src="/assets/icons/file-loader.gif"
                        width={80}
                        height={26}
                        alt="Loader"
                      />
                    </div>
                  </div>
                  <Image
                    src="/assets/icons/remove.svg"
                    width={24}
                    height={24}
                    className=" cursor-pointer invert-[1] opacity-95"
                    alt="Remove"
                    onClick={(e) => handleRemoveFile(e, file.name)}
                  />
                </li>
                {index < files.length - 1 && (
                  <Separator className=" opacity-25" />
                )}
              </Fragment>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default FileUploader;
