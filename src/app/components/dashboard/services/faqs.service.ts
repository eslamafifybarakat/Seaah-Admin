import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from '../../../shared/configs/roots';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FAQsService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getFAQsList(page?: number, per_page?: number, search?: string): Observable<any> {
    let params = new HttpParams();
    if (page) {
      params = params?.append("page_number", page);
    }
    if (per_page) {
      params = params?.append("page_size", per_page);
    }
    if (search) {
      params = params?.append("search", search);
    } else {
      params = params?.append("search", '');
    }
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.faqs.getAll}`, { params: params });
  }
  addEditFaq(data: any, id?: number): Observable<any> {
    if (id) {
      return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.faqs.addEditFaq}/${id}`, data)
    }
    return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.faqs.addEditFaq}`, data);
  }
  getFaqById(id: any): Observable<any> {
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.faqs.getAll}/${id}`);
  }
  deleteFaqById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${roots?.dashboard.faqs.deleteFaq}/` + id);
  }
}
