import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from "@nestjs/common";
  import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
  import { ErrorHender } from "src/utils/catchError";
  
  @Injectable()
  export class RefreshGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
  
    canActivate(context: ExecutionContext): boolean {
      const request:Request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
  
      console.log("Authorization header:", authHeader);
  
      if (!authHeader) {
        throw new NotFoundException("Token not found");
      }
  
      const [bearer, token] = authHeader.split(' ');
  
      if (bearer !== "Bearer" || !token) {
        throw new UnauthorizedException("Invalid authorization format");
      }
  
      try {
        const data = this.jwtService.verify(token, {
          secret: String(process.env.JWT_REFRESH_SECRET),
        });
  
        request["user"] = data;
        return true;
      } catch (error) {
        return ErrorHender(error);
      }
    }
  }
  