import React from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" min-h-screen flex">
      <section className="p-10 bg-slate-900 bg-gradient-slate-1 bg-no-repeat space-y-5 w-full md:w-1/2 lg:w-2/5 ">
        <div className="flex min-h-[90vh] w-full before:w-full before:md:w-1/2 before:lg:w-2/5  after:w-full after:md:w-1/2 after:lg:w-2/5 flex-col before:bg-gradient-slate-2 before:h-[500px] before:top-0 before:after-before-common-gradient-style after:after-before-common-gradient-style after:bg-gradient-slate-3 after:h-[400px] after:bottom-0 justify-around items-center ">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto"
          />

          <div
            className={`space-y-5 flex flex-col gap-y-6 text-white ${montserrat.className}`}
          >
            <h1 className="h1">Securely Store and Access Your Files</h1>
            <p className="h4">
              Experience seamless file management with reliable cloud storage.
            </p>
          </div>

          <Image
            src="/assets/images/files.png"
            alt="Files"
            width={342}
            height={342}
            className="transition-all hover:rotate-3 hover:scale-105"
          />
        </div>
      </section>

      {children}
    </div>
  );
};

export default layout;
