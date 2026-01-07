import React from 'react';

const SkeletonLoader: React.FC = () => {
    return (
        <div className="w-[794px] h-[1123px] bg-white shadow-2xl rounded-sm p-12 flex flex-col gap-8 animate-pulse relative overflow-hidden">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10"></div>

            {/* Header Area */}
            <div className="flex gap-6 items-center border-b border-gray-100 pb-8">
                <div className="w-24 h-24 rounded-full bg-gray-200 shrink-0"></div>
                <div className="flex flex-col gap-3 flex-grow">
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="flex gap-4 mt-2">
                        <div className="h-3 bg-gray-100 rounded w-20"></div>
                        <div className="h-3 bg-gray-100 rounded w-20"></div>
                        <div className="h-3 bg-gray-100 rounded w-20"></div>
                    </div>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="flex gap-8 h-full">
                {/* Left Column */}
                <div className="w-1/3 flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                        <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-6 bg-gray-100 rounded-full w-16"></div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-24 bg-gray-100 rounded w-full"></div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-2/3 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-4 bg-gray-100 rounded w-24"></div>
                                </div>
                                <div className="h-3 bg-gray-100 rounded w-1/4 mb-1"></div>
                                <div className="h-3 bg-gray-100 rounded w-full"></div>
                                <div className="h-3 bg-gray-100 rounded w-11/12"></div>
                                <div className="h-3 bg-gray-100 rounded w-full"></div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                        {[1, 2].map((item) => (
                            <div key={item} className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-4 bg-gray-100 rounded w-24"></div>
                                </div>
                                <div className="h-3 bg-gray-100 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
