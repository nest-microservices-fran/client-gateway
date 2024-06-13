import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from '../config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './guards/decorators';
import { CurrentUser } from './interfaces/current-user.interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('register')
  registerUser(
    @Body() registerUserDto: RegisterUserDto
  ) {
    return this.client.send('auth.register.user', registerUserDto).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @Post('login')
  loginUser(
    @Body() loginUserDto: LoginUserDto,
  ) {
    return this.client.send('auth.login.user', loginUserDto).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyUser(
    @User() user: CurrentUser,
    @Token() token: string
  ) {
    //return this.client.send('auth.verify.user', {});
    return { user, token };
  }
}
