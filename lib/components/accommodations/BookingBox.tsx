"use client";

import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface BookingSelection {
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    quantity: number;
}

export interface BookingBoxHandle {
    getBooking: () => BookingSelection;
}

interface BookingBoxProps {
    showQuantity?: boolean;
    maxQuantity?: number;
    onSelectionChange?: (selection: BookingSelection) => void;
}

function startOfDay(date: Date): Date {
    const value = new Date(date);
    value.setHours(0, 0, 0, 0);
    return value;
}

function addDays(date: Date, days: number): Date {
    const value = new Date(date);
    value.setDate(value.getDate() + days);
    return value;
}

function formatBookingDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Prop add kiya hai showQuantity taaki sirf Chalets mein dikhe
const BookingBox = forwardRef<BookingBoxHandle, BookingBoxProps>(function BookingBox(
    { showQuantity = false, maxQuantity, onSelectionChange },
    ref
) {
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const today = startOfDay(new Date());
        setCheckIn(today);
        setCheckOut(addDays(today, 1));
    }, []);

    useEffect(() => {
        if (!checkIn || !checkOut || !onSelectionChange) return;

        onSelectionChange({
            checkInDate: formatBookingDate(checkIn),
            checkOutDate: formatBookingDate(checkOut),
            adults,
            children,
            quantity,
        });
    }, [checkIn, checkOut, adults, children, quantity, onSelectionChange]);

    useEffect(() => {
        if (maxQuantity === undefined || maxQuantity < 1) return;
        if (quantity > maxQuantity) {
            setQuantity(maxQuantity);
        }
    }, [maxQuantity, quantity]);

    const quantityCap =
        maxQuantity !== undefined && maxQuantity > 0 ? maxQuantity : undefined;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useImperativeHandle(ref, () => ({
        getBooking: () => ({
            checkInDate: checkIn ? formatBookingDate(checkIn) : "",
            checkOutDate: checkOut ? formatBookingDate(checkOut) : "",
            adults,
            children,
            quantity,
        }),
    }));

    const checkInLabel = checkIn ? formatBookingDate(checkIn) : "Select date";
    const checkOutLabel = checkOut ? formatBookingDate(checkOut) : "Select date";
    const today = startOfDay(new Date());

    return (
        <div
            ref={dropdownRef}
            // Grid columns dynamic kar diye hain (3 ya 4)
            className={`grid grid-cols-1 ${showQuantity ? "md:grid-cols-4" : "md:grid-cols-3"} relative w-full`}
        >
            {/* 1. Check In */}
            <div className="pb-4 md:pb-0 md:pr-6 border-b md:border-b-0 md:border-r border-[#D8D0C8] relative w-full flex flex-col justify-between">
                <p className="text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[2px] text-[#A69C94] mb-2 font-jako-regular">
                    Check In
                </p>
                <button
                    onClick={() => setActiveDropdown(activeDropdown === "checkin" ? null : "checkin")}
                    className="w-full flex items-center justify-between text-left font-jako-bold text-[14px] font-[400]"
                >
                    <span className="text-[#BC2623] text-[13px] sm:text-[14px]" suppressHydrationWarning>{checkInLabel}</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ml-2 shrink-0 ${activeDropdown === "checkin" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                </button>

                {activeDropdown === "checkin" && checkIn && (
                    <div className="absolute top-full left-0 mt-2 z-[99999] scale-[0.85] md:scale-100 origin-top-left ">
                        <DatePicker
                            selected={checkIn}
                            minDate={today}
                            onChange={(date: Date | null) => {
                                if (date) {
                                    setCheckIn(date);
                                    if (checkOut && date >= checkOut) {
                                        setCheckOut(addDays(date, 1));
                                    }
                                    setActiveDropdown(null);
                                }
                            }}
                            inline
                        />
                    </div>
                )}
            </div>

            {/* 2. Check Out */}
            <div className="py-4 md:py-0 md:px-[12px] border-b md:border-b-0 md:border-r border-[#D8D0C8] relative w-full flex flex-col justify-between">
                <p className="text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[2px] text-[#A69C94] mb-2 font-jako-regular">
                    Check Out
                </p>
                <button
                    onClick={() => setActiveDropdown(activeDropdown === "checkout" ? null : "checkout")}
                    className="w-full flex items-center justify-between text-left font-jako-bold text-[14px] font-[400]"
                >
                    <span className="text-[#BC2623] text-[13px] sm:text-[14px]" suppressHydrationWarning>{checkOutLabel}</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ml-2 shrink-0 ${activeDropdown === "checkout" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                </button>



                {activeDropdown === "checkout" && checkIn && checkOut && (
                    <div className="absolute top-full left-0 mt-2 z-[99999] scale-[0.85] md:scale-100 origin-top-left shadow-xl bg-white">
                        <DatePicker
                            selected={checkOut}
                            minDate={addDays(checkIn, 1)}
                            filterDate={(d) => d > checkIn}
                            onChange={(date: Date | null) => {
                                if (date) {
                                    setCheckOut(date);
                                    setActiveDropdown(null);
                                }
                            }}
                            inline
                        />
                    </div>
                )}
            </div>

            {/* 3. Guests Column */}
            <div className={`py-4 md:py-0 md:px-[20px] relative w-full flex flex-col justify-between border-b md:border-b-0 ${showQuantity ? "md:border-r" : ""} border-[#D8D0C8]`}>
                <p className="text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[2px] text-[#A69C94] mb-2 font-jako-regular">
                    Guests
                </p>
                <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === "guests" ? null : "guests")}
                    className="w-full flex items-center justify-between text-left font-jako-bold text-[14px] font-[400]"
                >
                    <span className="text-[#BC2623] text-[13px] sm:text-[14px] uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                        {adults} {adults === 1 ? "Adult" : "Adults"}
                        {children > 0 && `, ${children} ${children === 1 ? "Child" : "Children"}`}
                    </span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ml-2 shrink-0 ${activeDropdown === "guests" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                </button>

                {activeDropdown === "guests" && (
                    <div className="absolute top-full right-0 mt-2 w-full min-w-[260px] md:w-[280px] bg-white rounded-xl shadow-2xl border border-[#D8D0C8] p-5 z-[99999] flex flex-col gap-4">
                        {/* Adults Row */}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[14px] font-jako-bold text-[#425a70]">Adults</span>
                                <span className="text-[11px] text-[#A69C94]">18 or above</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button type="button" disabled={adults <= 1} onClick={() => setAdults(adults - 1)} className="w-8 h-8 rounded-full border border-[#D8D0C8] flex items-center justify-center text-[#BC2623] hover:bg-gray-50 disabled:opacity-40 font-bold cursor-pointer"><svg width="12" height="12" viewBox="0 0 12 12">
                                    <path d="M1 6H11" stroke="#AF2F2C" strokeWidth="2" />
                                </svg></button>
                                <span className="text-[14px] font-jako-bold min-w-[20px] text-center">{adults}</span>
                                <button type="button" onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full border border-[#D8D0C8] flex items-center justify-center cursor-pointer text-[#BC2623] hover:bg-gray-50 font-bold"><svg width="12" height="12" viewBox="0 0 12 12">
                                    <path d="M1 6H11M6 1V11" stroke="#AF2F2C" strokeWidth="2" />
                                </svg></button>
                            </div>
                        </div>
                        {/* Children Row */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                            <div className="flex flex-col">
                                <span className="text-[14px] font-jako-bold text-[#425a70]">Children</span>
                                <span className="text-[11px] text-[#A69C94]">0-17</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button type="button" disabled={children <= 0} onClick={() => setChildren(children - 1)} className="w-8 h-8 rounded-full border border-[#D8D0C8] flex items-center justify-center text-[#BC2623] hover:bg-gray-50 disabled:opacity-40 font-bold cursor-pointer"><svg width="12" height="12" viewBox="0 0 12 12">
                                    <path d="M1 6H11" stroke="#AF2F2C" strokeWidth="2" />
                                </svg></button>
                                <span className="text-[14px] font-jako-bold min-w-[20px] text-center">{children}</span>
                                <button type="button" onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full border cursor-pointer border-[#D8D0C8] flex items-center justify-center text-[#BC2623] hover:bg-gray-50 font-bold"><svg width="12" height="12" viewBox="0 0 12 12">
                                    <path d="M1 6H11M6 1V11" stroke="#AF2F2C" strokeWidth="2" />
                                </svg></button>
                            </div>
                        </div>
                        <button type="button" onClick={() => setActiveDropdown(null)} className="w-full mt-2 py-3 bg-[#BC2623] text-white text-[12px] font-jako-bold uppercase tracking-[1px] rounded-lg">Done</button>
                    </div>
                )}
            </div>

            {/* 4. NEW: Quantity Column (GUEST Jaisa Design) */}
            {showQuantity && (
                <div className="py-4 md:py-0 md:pl-[28px] relative w-full flex flex-col justify-between">
                    <p className="text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[2px] text-[#A69C94] mb-2 font-jako-regular">
                        Quantity
                    </p>
                    <button
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === "quantity" ? null : "quantity")}
                        className="w-full flex items-center justify-between text-left font-jako-bold text-[14px] font-[400]"
                    >
                        <span className="text-[#BC2623] text-[13px] sm:text-[14px] uppercase">
                            {quantity} {quantity === 1 ? "Chalet" : "Chalets"}
                        </span>
                        <svg className={`w-4 h-4 transition-transform duration-200 ml-2 shrink-0 ${activeDropdown === "quantity" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    {activeDropdown === "quantity" && (
                        <div className="absolute top-full right-0 mt-2 w-full min-w-[260px] md:w-[280px] bg-white rounded-xl shadow-2xl border border-[#D8D0C8] p-5 z-[99999] flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-jako-bold text-[#425a70]">Chalets</span>
                                    <span className="text-[11px] text-[#A69C94]">Total Chalets to book</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* <button
                                        type="button"
                                        disabled={quantity <= 1}
                                        onClick={() => setQuantity(quantity - 1)}
                                        className="w-8 h-8 rounded-full border border-[#D8D0C8] flex items-center justify-center text-[#BC2623] hover:bg-gray-50 disabled:opacity-40 font-bold"
                                    >-</button> */}
                                    <button className="w-8 h-8 rounded-full border border-[#D8D0C8] flex items-center justify-center cursor-pointer
                                    "
                                        type="button"
                                        disabled={quantity <= 1}
                                        onClick={() => setQuantity(quantity - 1)}>
                                        <svg width="12" height="12" viewBox="0 0 12 12">
                                            <path d="M1 6H11" stroke="#AF2F2C" strokeWidth="2" />
                                        </svg>
                                    </button>
                                    <span className="text-[14px] font-jako-bold min-w-[20px] text-center">{quantity}</span>
                                    {/* <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 rounded-full border border-[#D8D0C8] flex items-center justify-center text-[#BC2623] hover:bg-gray-50 font-bold"
                                    >+</button> */}
                                    <button className="w-8 h-8 rounded-full border border-[#D8D0C8] flex items-center justify-center cursor-pointer"
                                        onClick={() => setQuantity(quantity + 1)}
                                        disabled={quantityCap !== undefined && quantity >= quantityCap}
                                        type="button">

                                        <svg width="12" height="12" viewBox="0 0 12 12">
                                            <path d="M1 6H11M6 1V11" stroke="#AF2F2C" strokeWidth="2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveDropdown(null)}
                                className="w-full mt-2 py-3 bg-[#BC2623] text-white text-[12px] font-jako-bold uppercase tracking-[1px] rounded-lg"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

export default BookingBox;