"use client";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { avatarPlaceholderUrl, navItems } from "@/constants";
import { montserrat } from "@/app/(auth)/layout";
import { Separator } from "./ui/separator";
// import { Link } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { signOutUser } from "@/lib/user.action";
import FileUploader from "./FileUploader";
import { userInformation } from "@/types";

const MobileNavbar = ({ userDetails }: { userDetails: userInformation }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  console.log(userDetails);
  const signOutHandeler = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <header
      className={`flex h-16 text-slate-300 justify-between items-center sm:hidden px-5 ${montserrat.className}`}
    >
      <Image
        src="/assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="mobileNavbar"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className=" flex flex-col gap-2  bg-slate-800">
          <SheetTitle className=" mt-5">
            <div className=" text-slate-100 bg-sky-500 my-3 flex items-center gap-2 rounded-full p-2 sm:justify-center lg:justify-start lg:p-3 ">
              <Image
                src={avatarPlaceholderUrl}
                alt="avatar"
                width={44}
                height={44}
                className="header-user-avatar"
              />
              <div className="sm:hidden lg:block">
                <p className=" font-semibold text-sm text-slate-200 capitalize">
                  {userDetails?.name}
                </p>
                <p className=" text-sm font-medium">{userDetails?.email}</p>
              </div>
            </div>
            <Separator className="mb-4 bg-opacity-0" />
          </SheetTitle>

          <nav className=" text-xl grow-[1] font-bold text-white gap-1 flex-1">
            <ul className=" flex flex-1 flex-col gap-3 text-white">
              {navItems.map(({ name, url, icon }) => {
                return (
                  <div key={name}>
                    <li
                      className={cn(
                        "flex gap-5  text-white  lg:w-full items-center grow-[1] justify-start px-[30px] h-[54px] rounded-full ",
                        pathname === url &&
                          "bg-indigo-500  shadow-indigo-500 shadow-md",
                        pathname !== url &&
                          "hover:shadow-sm hover:shadow-indigo-400"
                      )}
                    >
                      <Image
                        src={icon}
                        alt={name}
                        width={24}
                        height={24}
                        className={cn(
                          " w-6 invert-0 opacity-35",
                          pathname === url && " opacity-100"
                        )}
                      />
                      <p className="block lg:hidden">{name}</p>
                    </li>
                  </div>
                );
              })}
            </ul>
          </nav>

          {/* <Separator className="my-5  bg-opacity-0" /> */}

          <div className="flex flex-col justify-between gap-5 pb-5">
            {/* <FileUploader ownerId={ownerId} accountId={accountId} /> */}
            <FileUploader
              accountId={userDetails?.accountId}
              ownerId={userDetails?.$id}
            />
            <form action={signOutHandeler}>
              <Button
                type="submit"
                className={
                  "flex gap-2  text-black  w-full items-center grow-[1] justify-center px-[30px] h-[54px] rounded-full bg-sky-500 hover:shadow-indigo-500 hover:bg-indigo-500 transition-all duration-150 hover:text-black  shadow-blue-500 shadow-sm"
                }
              >
                <Image
                  src="/assets/icons/logout.svg"
                  alt="logo"
                  width={24}
                  height={24}
                  className="invert w-8 h-8"
                />
                <p className=" font-bold text-xl">Logout</p>
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavbar;
