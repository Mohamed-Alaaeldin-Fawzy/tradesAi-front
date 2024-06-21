import { Component, OnInit } from '@angular/core';
import { TradeService } from '../../services/trade.service';
import { SelectedInstrumentService } from '../../services/selected-instrument.service';
import { LoadingService } from '../../services/loading.service'; // Import LoadingService
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-instrument-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instrument-list.component.html',
  styleUrls: ['./instrument-list.component.css'],
})
export class InstrumentListComponent implements OnInit {
  instruments: any[] = [];
  paginatedInstruments: any[] = [];
  currentPage = 1;
  pageSize = 15;
  totalItems = 0;
  totalPages = 0;
  isLoading$ = this.loadingService.loading$;
  selectedInstrumentId = 0;

  InstrumentNotSelected$: Observable<boolean>;

  constructor(
    private tradeService: TradeService,
    private selectedInstrumentService: SelectedInstrumentService,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {
    this.InstrumentNotSelected$ =
      this.selectedInstrumentService.isInstrumentSelected$.pipe(
        map((isSelected) => !isSelected)
      );
  }

  ngOnInit(): void {
    this.loadInstruments();
  }

  loadInstruments(): void {
    this.loadingService.show();
    this.tradeService.getTradableInstruments().subscribe(
      (response) => {
        this.instruments = response.data;
        this.totalItems = this.instruments.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.paginateInstruments();
        this.loadingService.hide();
      },
      (error) => {
        console.error('Error fetching instruments:', error);
        this.toastr.error('Error fetching instruments', 'Error');
        this.loadingService.hide();
      }
    );
  }

  paginateInstruments(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedInstruments = this.instruments.slice(startIndex, endIndex);
  }

  selectInstrument(instrument: any): void {
    this.selectedInstrumentId = instrument.id; // Set the selected instrument's id
    this.selectedInstrumentService.setSelectedInstrument(instrument);
    console.log(this.selectedInstrumentId, instrument);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.paginateInstruments();
  }

  getPageNumbers(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }
}
