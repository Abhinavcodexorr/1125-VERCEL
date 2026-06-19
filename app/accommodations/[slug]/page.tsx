
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AccommodationBookingPanel from "@/lib/components/accommodations/AccommodationBookingPanel";
import AmenityList from "@/lib/components/accommodations/AmenityList";
import RoomImageGallery from "@/lib/components/accommodations/RoomImageGallery";
import {
    fetchRoomBySlug,
    fetchRooms,
    buildAccommodationTabs,
    getRoomDisplayTitle,
    getRoomDisplayType,
    mapRoomToPageData,
} from "@/lib/api/rooms";

export const revalidate = 60;

export async function generateStaticParams() {
    try {
        const rooms = await fetchRooms();
        if (rooms.length) {
            return rooms.map((room) => ({ slug: room.slug }));
        }
    } catch {
        // Fall back to known slugs at build time
    }

    return [{ slug: "the-villa" }, { slug: "chalets" }];
}

export default async function AccommodationDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const [apiRoom, allRooms] = await Promise.all([
        fetchRoomBySlug(slug).catch((error) => {
            console.error("Failed to load room:", error);
            return null;
        }),
        fetchRooms().catch(() => []),
    ]);

    if (!apiRoom) notFound();

    const room = mapRoomToPageData(apiRoom);
    const displayType = getRoomDisplayType(apiRoom);
    const availabilityUnit = room.slug === "chalets" ? "Chalet" : "Unit";

    const tabs = allRooms.length
        ? buildAccommodationTabs(allRooms, apiRoom)
        : [{ slug: room.slug, label: getRoomDisplayTitle(apiRoom) || room.slug }];

    return (
        <main className="bg-[#FFFEF8] min-h-screen">


            <section className="px-4 mt-4 relative ">
                <div className="relative h-[420px] md:h-[520px] overflow-hidden rounded-[24px]">
                    <Image
                        src="/images/b0a224ce805c59442793004b3d39bd16a7496666 (1).jpg"
                        alt="Gallery"
                        fill
                        priority
                        sizes="calc(100vw - 2rem)" className="object-cover object-bottom"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="font-serif text-white text-[45px] md:text-[65px] font-[400] font-ogg-regular text-center tracking-wide leading-none">
                            Book Your Stay
                        </h1>
                    </div>
                </div>
            </section>



            <section className="max-w-[1440px] mx-auto relative z-30 px-12 mt-6 sm:-mt-[70px] md:-mt-[85px] mb-4 sm:mb-0 hidden lg:block ">
                <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-end sm:gap-2.5">
                    {tabs.map((tab) => {
                        const isActive = room.slug === tab.slug;
                        return (
                            <Link
                                key={tab.slug}
                                scroll={false}
                                href={`/accommodations/${tab.slug}`}
                                    className={`
                                px-3 sm:px-7 py-4 lg:text-[16px] text-[12px] tracking-wider font-[400] 
                                rounded-xl sm:rounded-b-none sm:rounded-t-xl shrink-0 transition-all duration-150 
                                font-jeko-black w-full sm:w-auto text-center flex items-center justify-center
                                ${isActive
                                            ? "bg-[#AF2F2C] font-jeko-black text-[#FAF0E2] h-[54px] sm:h-[58px] sm:pt-5 sm:pb-4 pointer-events-none"
                                            : "bg-[#E5D7D7] hover:bg-[#dbd2c8] text-[#8C7A7A] h-[54px] sm:h-[48px] sm:py-3.5"
                                        }
                            `}
                                >
                                    {tab.label}
                                </Link>
                        );
                    })}
                </div>

            </section>



            <section className="max-w-[1440px] mx-auto relative z-20 px-12 pb-20 hidden lg:block">
                <div className="bg-white rounded-3xl sm:rounded-t-none sm:rounded-tr-3xl sm:rounded-b-3xl shadow-xl border border-[#ebe5dd] p-6 md:p-10">
                    <div className="grid lg:grid-cols-12 gap-10 items-start">
                        {/* LEFT COLUMN */}
                        <div className="w-full lg:col-span-5 shrink-0">
                            <RoomImageGallery
                                image={room.image}
                                galleryImages={room.galleryImages}
                                title={displayType}
                                currencySymbol={room.currencySymbol}
                                price={room.price}
                            />
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="w-full lg:col-span-7 flex flex-col justify-between min-h-[440px] pt-2">
                            <div>
                                <h2 className="font-ogg-regular text-[#7CA5C8] text-[38px] font-[500] lg:text-[38px] leading-tight ">
                                    {displayType}
                                </h2>
                                <p className="mt-4 text-[#242424] text-[16px] font-[400] leading-relaxed max-w-[540px] font-jako-regular">
                                    {room.description || "Experience a sanctuary..."}
                                </p>

                                <AmenityList amenities={room.amenities} />
                            </div>

                            {/* BOOKING BOX SECTION */}
                            <div className="w-full max-w-[600px] bg-[#FFFEF8] border border-[#E7DDD4] rounded-[12px] p-[24px] mt-10">
                                <AccommodationBookingPanel
                                    roomId={apiRoom._id}
                                    totalUnits={room.quantity}
                                    availabilityUnit={availabilityUnit}
                                    checkAvailability={room.slug === "chalets"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* mobile section  */}
            <section className="max-w-[1140px] mx-auto relative z-30 px-6 mt-6   sm:-mt-[70px] md:-mt-[85px] mb-4 sm:mb-0 lg:hidden">

                    <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-end sm:gap-2.5">
                        {tabs.map((tab) => {
                            const isActive = room.slug === tab.slug;
                            return (
                                <Link
                                    key={tab.slug}
                                    scroll={false}
                                    href={`/accommodations/${tab.slug}`}
                                    className={`
                                px-3 sm:px-7 py-4 sm:pt-5 sm:pb-4 lg:text-[16px] text-[12px] tracking-wider font-[400] 
                                rounded-xl sm:rounded-b-none sm:rounded-t-xl shrink-0 transition-all duration-150 
                                font-jeko-black w-full sm:w-auto text-center flex items-center justify-center
                                ${isActive
                                            ? "bg-[#AF2F2C] font-jeko-black text-[#FAF0E2] h-[54px] sm:h-[58px] sm:pt-5 sm:pb-4 pointer-events-none"
                                            : "bg-[#E5D7D7] hover:bg-[#dbd2c8] text-[#8C7A7A] h-[54px] sm:h-[48px] sm:py-3.5"
                                        }
                            `}
                                >
                                    {tab.label}
                                </Link>
                            );
                        })}
                </div>
            </section>

            {/* Main Details Showcase Card */}
            <section className="lg:hidden max-w-[1140px] mx-auto relative z-20 px-6 pb-20">

                    <div className="bg-white rounded-3xl sm:rounded-t-none sm:rounded-tr-3xl sm:rounded-b-3xl shadow-xl border border-[#ebe5dd] p-6 md:p-10">
                        <div className="grid lg:grid-cols-12 gap-10 items-start">

                            {/* LEFT COLUMN: Gallery & Price Showcase */}
                            <div className="w-full lg:col-span-5 shrink-0">
                                <RoomImageGallery
                                    image={room.image}
                                    galleryImages={room.galleryImages}
                                    title={displayType}
                                    currencySymbol={room.currencySymbol}
                                    price={room.price}
                                />
                            </div>

                            {/* RIGHT COLUMN: Description & SVG Icons Integration */}
                            <div className="w-full lg:col-span-7 flex flex-col justify-between min-h-[440px] pt-2">
                                <div>
                                    <h2 className="font-ogg-regular text-[#7CA5C8] text-[38px] font-[500] lg:text-[38px] leading-tight ">
                                        {displayType}
                                    </h2>

                                    <p className="mt-4 text-[#242424] text-[16px] font-[400] leading-relaxed max-w-[540px] font-jako-regular">
                                        {room.description || "Experience a sanctuary where the only schedule is the tide and the only dress code is the sand. Immerse yourself in uncompromising comfort meets brutalist architecture."}
                                    </p>

                                    <AmenityList amenities={room.amenities} />
                                </div>

                                {/* Booking Box */}
                                <div className="w-full max-w-[600px] min-h-[188px] bg-[#FFFEF8] border border-[#E7DDD4] rounded-[12px] p-[24px] mt-10">
                                    <AccommodationBookingPanel
                                        roomId={apiRoom._id}
                                        totalUnits={room.quantity}
                                        availabilityUnit={availabilityUnit}
                                        checkAvailability={room.slug === "chalets"}
                                    />
                                </div>

                            </div>

                        </div>
                    </div>
                </section>
        </main>
    );
}
