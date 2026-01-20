import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
// Note: decorators `UseGuards`, `Body` are already imported above

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() user: any, @Query('guestId') guestId: string) {
    const userId = user?.userId;
    return this.cartService.getCart(userId, guestId);
  }

  // Allow guest users to add to cart by providing a `guestId` in the body
  @Post('add')
  async addToCart(
    @CurrentUser() user: any,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const userId = user?.userId;
    const guestId = addToCartDto.guestId;
    return this.cartService.addToCart(userId, guestId, addToCartDto);
  }

  @Put('item/:productId')
  async updateCartItem(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
    @Query('variantId') variantId: string,
    @Query('guestId') guestId: string,
    @Body() updateDto: UpdateCartItemDto,
  ) {
    const userId = user?.userId;
    return this.cartService.updateCartItem(
      userId,
      guestId,
      productId,
      variantId,
      updateDto,
    );
  }

  @Delete('item/:productId')
  async removeFromCart(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
    @Query('variantId') variantId: string,
    @Query('guestId') guestId: string,
  ) {
    const userId = user?.userId;
    return this.cartService.removeFromCart(userId, guestId, productId, variantId);
  }

  @Delete('clear')
  async clearCart(@CurrentUser() user: any, @Query('guestId') guestId: string) {
    const userId = user?.userId;
    return this.cartService.clearCart(userId, guestId);
  }

  @Post('merge')
  @UseGuards(JwtAuthGuard)
  async mergeGuest(@CurrentUser() user: any, @Body('guestId') guestId: string) {
    return this.cartService.mergeGuestCart(user.userId, guestId);
  }
}
