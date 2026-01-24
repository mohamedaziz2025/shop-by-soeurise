import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override canActivate pour gérer les cas où le JWT est absent ou invalide
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Toujours retourner true pour permettre l'accès
    // Mais essayer de valider le JWT s'il est présent
    return super.canActivate(context) as boolean | Promise<boolean> | Observable<boolean>;
  }

  // Override handleRequest pour ne pas lancer d'exception si l'utilisateur n'est pas authentifié
  handleRequest(err, user, info, context) {
    // Si il y a un utilisateur valide, le retourner
    // Sinon retourner null sans lancer d'exception
    // Cela permet aux routes d'être accessibles sans authentification
    return user || null;
  }
}
