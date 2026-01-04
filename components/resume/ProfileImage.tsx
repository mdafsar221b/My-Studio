
import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, RotateCw, Trash2, User } from 'lucide-react';

interface ProfileImageProps {
    image?: string;
    onUpdate: (image: string | undefined) => void;
    size?: number;
    className?: string;
    editable?: boolean;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ image, onUpdate, size = 120, className = '', editable = true }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdate(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdate(undefined);
    };

    return (
        <div
            className={`relative group flex-shrink-0 ${className}`}
            style={{ width: size, height: size }}
        >
            <div
                className={`w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center relative cursor-pointer transition-all duration-300 ${!image ? 'hover:bg-slate-200' : ''}`}
                onClick={() => editable && fileInputRef.current?.click()}
            >
                {image ? (
                    <img
                        src={image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <User size={size * 0.4} className="text-slate-300" />
                )}

                {/* Hover Overlay for Edit */}
                {editable && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white/90 gap-1 backdrop-blur-[1px]">
                        <Camera size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                            {image ? 'Change' : 'Upload'}
                        </span>
                    </div>
                )}
            </div>

            {/* Remove Button */}
            {editable && image && (
                <button
                    onClick={handleRemove}
                    className="absolute top-0 right-0 p-1.5 bg-red-500 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10 hover:scale-110"
                    title="Remove Photo"
                >
                    <Trash2 size={12} />
                </button>
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default ProfileImage;
