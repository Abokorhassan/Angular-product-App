import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Product } from 'src/app/models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  endpoint: string = 'http://localhost:3900/api/product';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, public router: Router) {}

  getProductLists(): Observable<any> {
    return this.http.get<any>(this.endpoint);
  }

  addProduct(product): Observable<any> {
    return this.http.post<any>(this.endpoint, product);
  }

  updateProduct(id, product) {
    return this.http.put<any>(`${this.endpoint}/${id}`, product);
  }

  getProduct(id) {
    return this.http.get<any>(`${this.endpoint}/${id}`);
  }

  deleteProduct(id) {
    return this.http.delete<any>(`${this.endpoint}/${id}`);
  }
}
