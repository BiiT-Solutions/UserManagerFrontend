import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Constants} from "../shared/constants";
import {Injectable} from "@angular/core";
import {SessionService} from "../services/session.service";
import {Router} from "@angular/router";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService, private router: Router) {  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.sessionService.getToken();
    if (!authToken) {
      this.router.navigate(['/login']);
      return null;
    }
    const request: HttpRequest<any> = req.clone({
      headers: req.headers.append(Constants.HEADERS.AUTHORIZATION, `Bearer ${this.sessionService.getToken()}`)
    });
    return next.handle(request);
  }
}
