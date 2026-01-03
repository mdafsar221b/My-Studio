import { DesignConfig } from '../../types';

export const getFontSizeClass = (design: DesignConfig) => {
    if (design.fontSize === 'small') return 'text-[12px]';
    if (design.fontSize === 'large') return 'text-[16px]';
    return 'text-[14px]';
};

export const getHeadingSizeClass = (design: DesignConfig) => {
    if (design.fontSize === 'small') return 'text-base';
    if (design.fontSize === 'large') return 'text-2xl';
    return 'text-lg';
};
