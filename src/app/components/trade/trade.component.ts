import { Component, OnInit, OnDestroy } from '@angular/core';
import { TradeService } from '../../services/trade.service';
import { SelectedInstrumentService } from '../../services/selected-instrument.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, MatIconModule],
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css'],
})
export class TradeComponent implements OnInit, OnDestroy {
  name = '';
  isFormVisible = true;

  orderData = {
    price: 0,
    qty: 1,
    routeId: 0,
    side: '',
    tradableInstrumentId: 0,
    type: 'market',
    validity: 'IOC',
  };

  isInstrumentSelected$: Observable<boolean>;
  private subscription!: Subscription;

  constructor(
    private tradeService: TradeService,
    private selectedInstrumentService: SelectedInstrumentService,
    private toastr: ToastrService
  ) {
    this.isInstrumentSelected$ =
      this.selectedInstrumentService.isInstrumentSelected$;
  }

  ngOnInit(): void {
    this.subscription =
      this.selectedInstrumentService.selectedInstrument$.subscribe(
        (instrument) => {
          this.isFormVisible = true;
          this.name = instrument.name;
          this.orderData.tradableInstrumentId = instrument.tradableInstrumentId;
          if (instrument.routes !== undefined) {
            this.orderData.routeId = instrument.routes.filter(
              (r: { type: string; id: number }) => r.type === 'TRADE'
            )[0].id;
          }
        }
      );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setOrderType(side: string): void {
    this.orderData.side = side;
    this.placeOrder();
  }

  placeOrder(): void {
    this.tradeService.placeOrder(this.orderData).subscribe(
      (response) => {
        console.log('Order placed successfully:', response);
        this.toastr.success('Order placed successfully', 'Success');
      },
      (error) => {
        console.error('Error placing order:', error);
        this.toastr.error('Error placing order', 'Error');
      }
    );
  }

  increaseVolume(): void {
    this.orderData.qty = this.orderData.qty + 1;
  }

  decreaseVolume(): void {
    if (this.orderData.qty > 1) {
      this.orderData.qty = this.orderData.qty - 1;
    }
  }

  toggleFormVisibility(): void {
    this.isFormVisible = !this.isFormVisible;
  }
}
