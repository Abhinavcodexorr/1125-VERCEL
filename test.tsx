<section className="max-w-[1440px] mx-auto relative z-20 px-4 md:px-12 pb-20 block">
    <div className="bg-white rounded-b-3xl rounded-tr-3xl shadow-xl border border-[#ebe5dd] p-5 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* LEFT COLUMN: Main Image (Rectangle) + Thumbnails */}
            <div className="w-full lg:col-span-5 flex flex-col gap-4">

                {/* Main Rectangle Image */}
                <div className="relative rounded-2xl overflow-hidden bg-[#f9f8f6]">
                    <div className="absolute top-4 left-4 z-10 bg-[#C22D28] text-white px-4 py-2 rounded-xl text-base font-semibold shadow-md">
                        GHS {room.price || "650"}<span className="text-xs font-jeko-black font-normal opacity-90 ml-0.5">/night</span>
                    </div>
                    {/* Height ko rectangle banane ke liye md:h-[550px] kiya hai */}
                    <div className="relative h-[400px] md:h-[550px] ">
                        <Image
                            src={room.image}
                            alt={room.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* THUMBNAILS (Rectangular & Sized properly) */}
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <div className="relative h-16 md:h-20 rounded-xl overflow-hidden cursor-pointer">
                        <Image src="/images/book-us.jpg" alt="thumb" fill className="object-cover" />
                    </div>
                    <div className="relative h-16 md:h-20 rounded-xl overflow-hidden cursor-pointer">
                        <Image src="/images/corporate.jpg" alt="thumb" fill className="object-cover" />
                    </div>
                    <div className="relative h-16 md:h-20 rounded-xl overflow-hidden cursor-pointer">
                        <Image src="/images/beach-walk.jpg" alt="thumb" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white text-[10px] md:text-[12px] font-bold tracking-[2px] uppercase">Gallery</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Content (Figma Spacing) */}
            <div className="w-full lg:col-span-7 flex flex-col pt-2">
                <div>
                    <h2 className="font-ogg-regular text-[#7CA5C8] text-[32px] md:text-[45px] font-[500] leading-tight">
                        {room.title || "The Villa"}
                    </h2>
                    <p className="mt-4 text-[#242424] text-[16px] font-[400] leading-relaxed max-w-[540px] font-jako-regular">
                        {room.description || "Experience a sanctuary where the only schedule is the tide and the only dress code is the sand."}
                    </p>

                    {/* Features Icons */}
                    <div className="grid grid-cols-2 gap-y-6 mt-10">
                        {/* Hot & Cold Shower */}
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-[#C22D28]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A3.75 3.75 0 0 0 2.25 7.5v10.5a1.5 1.5 0 0 0 1.5 1.5H18a1.5 1.5 0 0 0 1.5-1.5V7.5A3.75 3.75 0 0 0 15.75 3.75h-1.5m-6.75 0v3.75m6.75-3.75v3.75M5.25 7.5h13.5M7.5 11.25h.008v.008H7.5v-.008Zm3.75 0h.008v.008h-.008v-.008Zm3.75 0h.008v.008H15v-.008Zm-7.5 3.75h.008v.008H7.5v-.008Zm3.75 0h.008v.008h-.008v-.008Zm3.75 0h.008v.008H15v-.008Z" />
                            </svg>
                            <span className="font-jako-medium text-[14px] font-[400]">Hot & Cold Shower</span>
                        </div>

                        {/* Air Conditioning */}
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-[#C22D28]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75A1.875 1.875 0 0 1 20.25 6.375v1.5a1.875 1.875 0 0 1-1.875 1.875H5.625A1.875 1.875 0 0 1 3.75 7.875v-1.5A1.875 1.875 0 0 1 5.625 4.5Z" />
                            </svg>
                            <span className="font-jako-medium text-[14px] font-[400]">Air Conditioning</span>
                        </div>

                        {/* High-Speed WiFi */}
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-[#C22D28]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856a9.75 9.75 0 0 1 13.788 0M1.924 8.674a14.25 14.25 0 0 1 20.152 0M12 19.25h.008v.008H12v-.008Z" />
                            </svg>
                            <span className="font-jako-medium text-[14px] font-[400]">High-Speed WiFi</span>
                        </div>

                        {/* Equipped Kitchenette */}
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-[#C22D28]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                            <span className="font-jako-medium text-[14px] font-[400]">Equipped Kitchenette</span>
                        </div>

                        {/* Mini Fridge */}
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-[#C22D28]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75h-9A2.25 2.25 0 0 0 5.25 6v12a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25Zm-6.75 4.5h.008v.008h-.008V8.25Zm0 4.5h.008v.008h-.008v-.008Z" />
                            </svg>
                            <span className="font-jako-medium text-[14px] font-[400]">Mini Fridge</span>
                        </div>

                        {/* Flat Screen TV */}
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-[#C22D28]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-9-3v3m6-3v3M3.75 3.75h16.5A1.5 1.5 0 0 1 21.75 5.25v10.5a1.5 1.5 0 0 1-1.5 1.5H3.75A1.5 1.5 0 0 1 2.25 15.75V5.25A1.5 1.5 0 0 1 3.75 3.75Z" />
                            </svg>
                            <span className="font-jako-medium text-[14px] font-[400]">Flat Screen TV</span>
                        </div>

                        {/* On-Request Laundry */}
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-[#AF2F2C]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.50 6h15m-15 12h15" />
                            </svg>
                            <span className="font-jako-medium text-[14px] font-[400]">On-Request Laundry</span>
                        </div>

                        {/* Butler Service */}
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-[#AF2F2C]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <span className="font-jako-medium text-[14px] font-[400]">Butler Service</span>
                        </div>
                    </div>
                </div>

                {/* BOOKING BOX: Cream background and Rectangle style */}
                <div className="w-full bg-[#FFFEF8] border border-[#E7DDD4] rounded-2xl p-6 md:p-8 mt-10">
                    <BookingBox showQuantity={slug === "chalets"} />
                    <div className="mt-8 flex justify-center lg:justify-start">
                        <Link
                            href="/payment"
                            className="w-full max-w-[320px] h-[62px] rounded-full bg-[#BC2623] text-white uppercase text-[14px] font-bold tracking-[1.5px] shadow-lg transition-all duration-300 hover:bg-[#A92320] flex items-center justify-center text-center cursor-pointer"
                        >
                            Complete Reservation
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>