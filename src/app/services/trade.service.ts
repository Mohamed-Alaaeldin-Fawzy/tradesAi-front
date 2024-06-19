import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class TradeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  placeOrder(orderData: any): Observable<any> {
    const response = this.http.post(
      `${this.apiUrl}/trades/place-order`,
      orderData
    );
    return response;
  }

  getTradableInstruments(): Observable<any> {
    const response = this.http.get(`${this.apiUrl}/trades`);
    return response;
  }
}
