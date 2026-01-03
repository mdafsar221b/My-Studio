
import React, { useState } from 'react';
import { Check, Star, Download, Palette, Layout, Mail, Shield, Zap } from 'lucide-react';

interface Props {
    onClose: () => void;
}

const PremiumModal: React.FC<Props> = ({ onClose }) => {
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

    const plans = {
        monthly: { price: 199.00, gst: 35.82, total: 234.82 },
        yearly: { price: 1791.00, gst: 322.38, total: 2113.38, save: 597.00 }
    };

    const currentPlan = plans[selectedPlan];

    return (
        <div className="fixed inset-0 bg-shades-black-100/90 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-shades-black-100 border border-shades-black-80 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full text-shades-black-60 hover:text-shades-white-100 hover:bg-shades-black-80 transition-all z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Left Side: Perks */}
                <div className="w-full md:w-5/12 p-8 bg-shades-black-90 border-r border-shades-black-80 relative overflow-hidden flex flex-col justify-center">
                    {/* Decorative Background Elements */}
                    <div className="absolute -top-20 -left-20 w-48 h-48 bg-shades-white-100/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-shades-white-100/5 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-shades-white-100 rounded-lg shadow-lg">
                                <Star className="w-5 h-5 text-shades-black-100 fill-current" />
                            </div>
                            <div>
                                <h3 className="text-shades-black-60 font-bold uppercase tracking-widest text-[10px] mb-0.5">Upgrade to Premium</h3>
                                <h2 className="text-xl font-bold text-shades-white-100 leading-tight">Unlock Full Power</h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: <Download size={16} />, text: "Unlimited Downloads (PDF, Word, TXT, PNG)" },
                                { icon: <Layout size={16} />, text: "100+ Premium Templates & Ethnic Designs" },
                                { icon: <Palette size={16} />, text: "Millions of Color Edits & Customizations" },
                                { icon: <Zap size={16} />, text: "Instant View Switching & Live Preview" },
                                { icon: <Mail size={16} />, text: "Exclusive Career Newsletter & Tips" },
                            ].map((perk, idx) => (
                                <div key={idx} className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-shades-black-100 border border-shades-black-80 flex items-center justify-center text-shades-white-100 group-hover:bg-shades-white-100 group-hover:text-shades-black-100 transition-all shadow-md">
                                        {perk.icon}
                                    </div>
                                    <span className="text-shades-white-90 text-sm font-medium leading-snug">{perk.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-shades-black-80 flex items-center gap-2 text-shades-black-60 text-[10px]">
                            <Shield size={12} />
                            <span>Guaranteed safe & secure payment processing.</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Plans */}
                <div className="w-full md:w-7/12 p-8 bg-shades-black-100 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-shades-white-100 mb-6">Choose your plan</h3>

                    <div className="space-y-3 mb-6">
                        {/* Monthly Plan */}
                        <div
                            onClick={() => setSelectedPlan('monthly')}
                            className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all group ${selectedPlan === 'monthly' ? 'border-shades-white-100 bg-shades-white-100/5' : 'border-shades-black-80 hover:border-shades-black-70'}`}
                        >
                            <div className="flex items-center justify-between pointer-events-none">
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'monthly' ? 'border-shades-white-100' : 'border-shades-black-60 group-hover:border-shades-black-40'}`}>
                                        {selectedPlan === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-shades-white-100"></div>}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-shades-white-100 text-base">Premium Monthly</h4>
                                        <p className="text-shades-black-60 text-xs">Cancel anytime</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-shades-white-100 text-lg">₹199.00</span>
                                    <span className="text-[10px] text-shades-black-60">+ GST (18%)</span>
                                </div>
                            </div>
                        </div>

                        {/* Yearly Plan */}
                        <div
                            onClick={() => setSelectedPlan('yearly')}
                            className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all group ${selectedPlan === 'yearly' ? 'border-shades-white-100 bg-shades-white-100/5' : 'border-shades-black-80 hover:border-shades-black-70'}`}
                        >
                            <div className="absolute -top-2.5 right-4 bg-shades-white-100 text-shades-black-100 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                                SAVE ₹597.00
                            </div>
                            <div className="flex items-center justify-between pointer-events-none">
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'yearly' ? 'border-shades-white-100' : 'border-shades-black-60 group-hover:border-shades-black-40'}`}>
                                        {selectedPlan === 'yearly' && <div className="w-2.5 h-2.5 rounded-full bg-shades-white-100"></div>}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-shades-white-100 text-base">Premium Yearly</h4>
                                        <p className="text-shades-black-60 text-xs">Best Value</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-shades-white-100 text-lg">₹1,791.00</span>
                                    <span className="text-[10px] text-shades-black-60">+ GST (18%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-shades-black-90 rounded-lg p-5 mb-6 border border-shades-black-80">
                        <div className="flex justify-between mb-2 text-shades-black-60 text-sm">
                            <span>Price</span>
                            <span>₹{currentPlan.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-3 text-shades-black-60 text-sm">
                            <span>GST (18%)</span>
                            <span>₹{currentPlan.gst.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-shades-black-80 mb-3"></div>
                        <div className="flex justify-between text-shades-white-100 font-bold text-base">
                            <span>Total Amount</span>
                            <span>₹{currentPlan.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button className="w-full py-3 bg-shades-white-100 text-shades-black-100 rounded-lg font-bold text-base hover:bg-shades-white-90 transition-all shadow-xl shadow-white/10 active:scale-[0.98] flex items-center justify-center gap-2 group">
                        <Zap className="fill-current w-4 h-4 group-hover:scale-110 transition-transform" />
                        Upgrade Plan Now
                    </button>

                    <p className="text-center mt-3 text-shades-black-60 text-[10px]">
                        Payments are secure and encrypted.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PremiumModal;
