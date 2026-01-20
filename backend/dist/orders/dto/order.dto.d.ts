declare class AddressDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    additionalInfo?: string;
}
export declare class CreateOrderDto {
    shippingAddress: AddressDto;
    billingAddress?: AddressDto;
    customerNote?: string;
}
export {};
