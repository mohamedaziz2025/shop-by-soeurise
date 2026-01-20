declare class DimensionsDto {
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
}
export declare class CreateProductDto {
    name: string;
    description: string;
    shortDescription: string;
    price: number;
    compareAtPrice?: number;
    discountPercent?: number;
    mainImage: string;
    images?: string[];
    category: string;
    tags?: string[];
    stock?: number;
    sku?: string;
    dimensions?: DimensionsDto;
    hasVariants?: boolean;
    metaTitle?: string;
    metaDescription?: string;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    shortDescription?: string;
    status?: string;
    price?: number;
    compareAtPrice?: number;
    discountPercent?: number;
    mainImage?: string;
    images?: string[];
    category?: string;
    tags?: string[];
    stock?: number;
    sku?: string;
    dimensions?: DimensionsDto;
    metaTitle?: string;
    metaDescription?: string;
}
declare class VariantOptionDto {
    name: string;
    value: string;
}
export declare class CreateVariantDto {
    name: string;
    options: VariantOptionDto[];
    price?: number;
    compareAtPrice?: number;
    stock: number;
    sku: string;
    image?: string;
    weight?: number;
}
export declare class UpdateVariantDto {
    name?: string;
    price?: number;
    compareAtPrice?: number;
    stock?: number;
    image?: string;
    weight?: number;
    isActive?: boolean;
}
export {};
