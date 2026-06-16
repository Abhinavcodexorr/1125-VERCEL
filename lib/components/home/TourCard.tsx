"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
interface TourCardProps {
image: string;
title: string;
feature: string;
labelType: string;
labelValue: string;
}
export default function TourCard({
image,
title,
feature,
labelType,
labelValue,
}: TourCardProps) {
return (
<div
   className="
   h-auto
   rounded-[18px]
   border border-white/40
   bg-white/5
   backdrop-blur-sm
   p-[14px]
   flex
   flex-col
   shadow-[0_4px_20px_rgba(0,0,0,0.08)]
   "
   >
{/* Image */}
<div
   className="
   relative
   w-full
   aspect-[246/218]
   overflow-hidden
   rounded-[8px]
   "
   >
   <Image
      src={image}
      alt={title}
      fill
      className="object-cover object-center"
      />
</div>

<div className="flex items-center justify-between gap-3 mt-5">
   <h3
      className="
      font-ogg-trial
      text-white
      text-[30px]
      md:text-[22px]
      lg:text-[24px]
      font-[500]
      leading-[128%]
      tracking-[1px]
      capitalize
      max-w-[190px]
      "
      >
      {title}
   </h3>
   <button
      className="
     
      w-[31px]
      h-[31px]
      rounded-full
      overflow-hidden
      "
      >
      <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
         <rect width="31" height="31" rx="15.5" fill="#AE2020" />
         <path d="M23.9571 16.2071C24.3476 15.8166 24.3476 15.1834 23.9571 14.7929L17.5931 8.42893C17.2026 8.03841 16.5695 8.03841 16.1789 8.42893C15.7884 8.81946 15.7884 9.45262 16.1789 9.84315L21.8358 15.5L16.1789 21.1569C15.7884 21.5474 15.7884 22.1805 16.1789 22.5711C16.5695 22.9616 17.2026 22.9616 17.5931 22.5711L23.9571 16.2071ZM7.75 15.5V16.5H23.25V15.5V14.5H7.75V15.5Z" fill="#FFFEF8" />
      </svg>
   </button>
</div>
{/* Table Area */}
{/* 
<div className="mt-auto pt-5">
*/}
<div className=" mt-4 pt-5">
   <div className="border-t border-white/30" />
      {/* Features Row */}
      <div
         className="
         flex
         justify-between
         items-start
         py-4
         border-b
         border-white/30
         "
         >
         <span
            className="
            font-jeko-bold
            text-white
            text-[14px]
            leading-[128%]
            tracking-[1px]
            capitalize
            "
            >
         Features
         </span>
         <span
            className="
            font-jeko-medium
            text-white
            text-[14px]
            leading-[128%]
            tracking-[1px]
            text-right
            max-w-[145px]
            capitalize
            "
            >
         {feature}
         </span>
      </div>
      {/* Capacity / Units / Occupancy */}
      <div
         className="
         flex
         justify-between
         items-center
         py-4
         "
         >
         <span
            className="
            font-jeko-bold
            text-white
            text-[14px]
            leading-[128%]
            tracking-[1px]
            capitalize
            "
            >
         {labelType}
         </span>
         <span
            className="
            font-jeko-medium
            text-white
            text-[14px]
            leading-[128%]
            tracking-[1px]
            text-right
            "
            >
         {labelValue}
         </span>
      </div>
   </div>
</div>
);
}