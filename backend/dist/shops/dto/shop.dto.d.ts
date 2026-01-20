declare class ShippingConfigDto {
    enabled?: boolean;
    flatRate?: number;
    freeShippingThreshold?: number;
    maxShippingCost?: number;
    estimatedDays?: number;
    shippingZones?: string[];
}
declare class SocialMediaDto {
    instagram?: string;
    facebook?: string;
    website?: string;
}
export declare class CreateShopDto {
    name: string;
    description: string;
    logo?: string;
    banner?: string;
    categories?: string[];
    shippingConfig?: ShippingConfigDto;
    returnPolicy?: string;
    privacyPolicy?: string;
    socialMedia?: SocialMediaDto;
}
export declare class UpdateShopDto {
    name?: string;
    description?: string;
    logo?: string;
    banner?: string;
    categories?: string[];
    shippingConfig?: ShippingConfigDto;
    returnPolicy?: string;
    privacyPolicy?: string;
    socialMedia?: SocialMediaDto;
}
export {};
