import { Component, Input, OnInit } from '@angular/core';
import { TradeService } from '../../services/trade.service';
import { SelectedInstrumentService } from '../../services/selected-instrument.service';
import { LoadingService } from '../../services/loading.service'; // Import LoadingService
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-instrument-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './instrument-list.component.html',
  styleUrls: ['./instrument-list.component.css'],
})
export class InstrumentListComponent implements OnInit {
  @Input() instruments: any[] = [];
  @Input() types: any[] = [];

  filteredInstruments: any[] = [];
  searchQuery: string = '';
  selectedType: string = '';

  isLoading$ = this.loadingService.loading$;
  selectedInstrumentId = 0;
  InstrumentNotSelected$: Observable<boolean>;

  constructor(
    private selectedInstrumentService: SelectedInstrumentService,
    private loadingService: LoadingService
  ) {
    this.InstrumentNotSelected$ =
      this.selectedInstrumentService.isInstrumentSelected$.pipe(
        map((isSelected) => !isSelected)
      );
  }

  ngOnInit(): void {
    if (this.instruments.length > 0) {
      this.selectInstrument(this.instruments[0]);
    }
    this.filteredInstruments = [...this.instruments];
  }

  ngOnChanges(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredInstruments = this.instruments.filter(
      (inst) =>
        (this.selectedType ? inst.type === this.selectedType : true) &&
        (this.searchQuery
          ? inst.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true)
    );
  }

  selectInstrument(instrument: any): void {
    this.selectedInstrumentId = instrument.id;
    this.selectedInstrumentService.setSelectedInstrument(instrument);
  }
}
