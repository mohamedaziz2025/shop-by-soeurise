import { IsNotEmpty, IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class BecomeSellerDto {
  @IsNotEmpty({ message: 'Le nom de l\'entreprise est requis' })
  @IsString({ message: 'Le nom de l\'entreprise doit être une chaîne de caractères' })
  businessName: string;

  @IsNotEmpty({ message: 'La description de l\'entreprise est requise' })
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  businessDescription: string;

  @IsNotEmpty({ message: 'Le numéro SIRET est requis' })
  @IsString({ message: 'Le SIRET doit être une chaîne de caractères' })
  siret: string;

  @IsOptional()
  @IsString({ message: 'Le numéro TVA doit être une chaîne de caractères' })
  tvaNumber?: string;

  @IsNotEmpty({ message: 'La forme juridique est requise' })
  @IsString({ message: 'La forme juridique doit être une chaîne de caractères' })
  legalForm: string;

  // Adresse professionnelle
  @IsNotEmpty({ message: 'La rue est requise' })
  @IsString()
  businessStreet: string;

  @IsNotEmpty({ message: 'La ville est requise' })
  @IsString()
  businessCity: string;

  @IsNotEmpty({ message: 'Le code postal est requis' })
  @IsString()
  businessPostalCode: string;

  @IsOptional()
  @IsString()
  businessCountry?: string;

  // Contact professionnel
  @IsNotEmpty({ message: 'L\'email professionnel est requis' })
  @IsEmail({}, { message: 'L\'email professionnel doit être valide' })
  businessEmail: string;

  @IsNotEmpty({ message: 'Le téléphone professionnel est requis' })
  @IsString()
  businessPhone: string;
}