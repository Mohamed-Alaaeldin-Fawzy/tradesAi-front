import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TradeComponent } from './components/trade/trade.component';
import { InstrumentListComponent } from './components/instrument-list/instrument-list.component';
import { ChartComponent } from './components/chart/chart.component';
import { CommonModule } from '@angular/common';
import { LoadingService } from './services/loading.service';
import { TradeService } from './services/trade.service';
import { ToastrService } from 'ngx-toastr';
import { PositionsComponent } from './components/positions/positions.component';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ChartComponent,
    RouterOutlet,
    NavbarComponent,
    TradeComponent,
    InstrumentListComponent,
    CommonModule,
    PositionsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  instruments: any[] = [];
  types: any[] = [];
  positions: any[] = [];
  constructor(
    public loadingService: LoadingService,
    private tradeService: TradeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadingService.show();
    this.loadInstruments()
      .pipe(
        switchMap((instrumentsResponse) => {
          if (instrumentsResponse.success) {
            return this.loadPositions();
          } else {
            this.toastr.error('Failed to load instruments', 'Error');
            return of(null);
          }
        })
      )
      .subscribe({
        next: (positionsResponse) => {
          if (positionsResponse && positionsResponse.success) {
            console.log('Positions loaded successfully');
          }
          this.loadingService.hide();
        },
        error: (error) => {
          console.error('Error in loading data:', error);
          this.toastr.error('Error during loading processes', 'Error');
          this.loadingService.hide();
        },
      });
  }

  loadInstruments(): Observable<any> {
    return this.tradeService.getTradableInstruments().pipe(
      tap({
        next: (response) => {
          this.instruments = response.data;
          this.extractUniqueCategories();
        },
        error: (error) => {
          console.error('Error fetching instruments:', error);
          this.toastr.error('Error fetching instruments', 'Error');
        },
      })
    );
  }

  loadPositions(): Observable<any> {
    return this.tradeService.getPositions().pipe(
      tap({
        next: (response) => {
          this.positions = response.data.d.positions.map((position: any) => {
            const positionIdAsString = position[1].toString();

            const instrument = this.instruments.find(
              (inst) =>
                inst.tradableInstrumentId.toString() === positionIdAsString
            );

            if (instrument) {
              console.log(
                `Matching instrument found for position ID ${position[1]}: ${instrument.name}`
              );
              position[1] = instrument.name;
            }

            return position;
          });
          console.log(this.positions);
        },
        error: (error) => {
          console.error('Error fetching positions:', error);
          this.toastr.error('Error fetching positions', 'Error');
        },
      })
    );
  }
  extractUniqueCategories() {
    const types = new Set(
      this.instruments.map((instrument) => instrument.type)
    );
    this.types = Array.from(types);
  }
}
