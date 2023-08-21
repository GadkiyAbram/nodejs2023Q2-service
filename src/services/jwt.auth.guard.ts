import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  static UNAUTHORIZED_MESSAGE = 'Forbidden resource';
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ') ?? [];

    if (!token) {
      return false;
    }

    try {
      request.user = this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}
