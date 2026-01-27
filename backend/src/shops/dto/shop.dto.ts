import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ShippingConfigDto {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsNumber()
  @IsOptional()
  flatRate?: number;

  @IsNumber()
  @IsOptional()
  freeShippingThreshold?: number;

  @IsNumber()
  @IsOptional()
  maxShippingCost?: number;

  @IsNumber()
  @IsOptional()
  estimatedDays?: number;

  @IsArray()
  @IsOptional()
  shippingZones?: string[];
}

class SocialMediaDto {
  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  facebook?: string;

  @IsString()
  @IsOptional()
  website?: string;
}

export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  shippingPrice: number;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  banner?: string;

  @IsArray()
  @IsOptional()
  categories?: string[];

  @ValidateNested()
  @Type(() => ShippingConfigDto)
  @IsOptional()
  shippingConfig?: ShippingConfigDto;

  @IsString()
  @IsOptional()
  returnPolicy?: string;

  @IsString()
  @IsOptional()
  privacyPolicy?: string;

  @ValidateNested()
  @Type(() => SocialMediaDto)
  @IsOptional()
  socialMedia?: SocialMediaDto;
}

export class UpdateShopDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  shippingPrice?: number;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  banner?: string;

  @IsArray()
  @IsOptional()
  categories?: string[];

  @ValidateNested()
  @Type(() => ShippingConfigDto)
  @IsOptional()
  shippingConfig?: ShippingConfigDto;

  @IsString()
  @IsOptional()
  returnPolicy?: string;

  @IsString()
  @IsOptional()
  privacyPolicy?: string;

  @ValidateNested()
  @Type(() => SocialMediaDto)
  @IsOptional()
  socialMedia?: SocialMediaDto;
}
