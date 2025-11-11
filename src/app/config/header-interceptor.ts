import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Constants} from "../shared/constants";
import {Injectable} from "@angular/core";
import {SessionService} from "@biit-solutions/user-manager-structure";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService) {  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const reqHeaders: HttpHeaders = req.headers
      .append(Constants.HEADERS.AUTHORIZATION, `Bearer ${this.sessionService.getToken()}`)
      .append(Constants.HEADERS.CACHE_CONTROL, 'no-cache')
      .append(Constants.HEADERS.PRAGMA, 'no-cache');

    const request: HttpRequest<any> = req.clone({
      headers: reqHeaders
    });

    return next.handle(request);
  }
}
