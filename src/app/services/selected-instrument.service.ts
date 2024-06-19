import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectedInstrumentService {
  private selectedInstrument = new BehaviorSubject<any>({
    name: '',
    tradableInstrumentId: 0,
    routeId: 0,
  });
  selectedInstrument$ = this.selectedInstrument.asObservable();

  private isInstrumentSelected = new BehaviorSubject<boolean>(false);
  isInstrumentSelected$ = this.isInstrumentSelected.asObservable();

  setSelectedInstrument(instrument: any): void {
    this.selectedInstrument.next(instrument);
    this.isInstrumentSelected.next(true);
  }

  resetSelectedInstrument(): void {
    this.selectedInstrument.next({
      name: '',
      tradableInstrumentId: 0,
      routeId: 0,
    });
    this.isInstrumentSelected.next(false);
  }
}
