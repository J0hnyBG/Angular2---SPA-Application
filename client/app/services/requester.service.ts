import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'angular2-cookie/services/cookies.service';

const storageSessionKey = 'sessionKey';
@Injectable()
export class AjaxRequesterService<T> {
    private http: Http;
    private cookieService: CookieService;

    constructor(http: Http, cookieService: CookieService) {
        this.http = http;
        this.cookieService = cookieService;
    }

    public get(url: string): Observable<T[]> {
        return this.http.get(url)
            .map(res => JSON.parse(res.json()));
    }

    public post(url: string, item: any, isAuthenticated: boolean, headers?: any): Observable<T> {
        let parsedHeaders = this.prepareHeaders(isAuthenticated, headers);

        return this.http
            .post(url, JSON.stringify(item), { headers: parsedHeaders })
            .map(res => JSON.parse(res.json()));
    }

    public put(url: string, item: any, isAuthenticated: boolean, headers?: any): Observable<T> {
        let parsedHeaders = this.prepareHeaders(isAuthenticated, headers);

        return this.http
            .put(url, JSON.stringify(item), { headers: parsedHeaders })
            .map(res => JSON.parse(res.json()));
    }

    private prepareHeaders(isAuthenticated: boolean, options?: any): Headers {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        if (isAuthenticated) {
            let session = this.cookieService.get(storageSessionKey);
            headers.append('x-auth-token', session);
        }

        if (options) {
            for (let header of Object.keys(options)) {
                headers.append(header, options[header]);
            }
        }

        return headers;
    }
}
