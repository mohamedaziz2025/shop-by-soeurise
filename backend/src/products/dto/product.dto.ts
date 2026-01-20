import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DimensionsDto {
  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  length?: number;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  compareAtPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsString()
  @IsNotEmpty()
  mainImage: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsString()
  @IsOptional()
  sku?: string;

  @ValidateNested()
  @Type(() => DimensionsDto)
  @IsOptional()
  dimensions?: DimensionsDto;

  @IsBoolean()
  @IsOptional()
  hasVariants?: boolean;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  compareAtPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsString()
  @IsOptional()
  mainImage?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsString()
  @IsOptional()
  sku?: string;

  @ValidateNested()
  @Type(() => DimensionsDto)
  @IsOptional()
  dimensions?: DimensionsDto;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;
}

class VariantOptionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantOptionDto)
  options: VariantOptionDto[];

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  compareAtPrice?: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;
}

export class UpdateVariantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  compareAtPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
