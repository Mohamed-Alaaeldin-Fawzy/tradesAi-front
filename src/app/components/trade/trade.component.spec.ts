import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TradeComponent } from './trade.component';
import { TradeService } from '../../services/trade.service';
import { SelectedInstrumentService } from '../../services/selected-instrument.service';
import { of, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

class MockTradeService {
  placeOrder(orderData: any): Observable<any> {
    return of({ success: true });
  }
}

class MockSelectedInstrumentService {
  isInstrumentSelected$ = of(true);
  selectedInstrument$ = of({
    name: 'Instrument Name',
    tradableInstrumentId: 1,
    routes: [{ type: 'TRADE', id: 1 }],
  });
}

describe('TradeComponent', () => {
  let component: TradeComponent;
  let fixture: ComponentFixture<TradeComponent>;
  let tradeService: TradeService;
  let selectedInstrumentService: SelectedInstrumentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, DragDropModule],
      declarations: [TradeComponent],
      providers: [
        { provide: TradeService, useClass: MockTradeService },
        {
          provide: SelectedInstrumentService,
          useClass: MockSelectedInstrumentService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeComponent);
    component = fixture.componentInstance;
    tradeService = TestBed.inject(TradeService);
    selectedInstrumentService = TestBed.inject(SelectedInstrumentService);
    fixture.detectChanges();
  });

  it('should create the Trade component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct instrument data', () => {
    expect(component.name).toBe('Instrument Name');
    expect(component.orderData.tradableInstrumentId).toBe(1);
    expect(component.orderData.routeId).toBe(1);
  });

  it('should set order type and place order', () => {
    spyOn(component, 'placeOrder');
    component.setOrderType('buy');
    expect(component.orderData.side).toBe('buy');
    expect(component.placeOrder).toHaveBeenCalled();
  });

  it('should increase volume', () => {
    component.orderData.qty = 1;
    component.increaseVolume();
    expect(component.orderData.qty).toBe(2);
  });

  it('should decrease volume', () => {
    component.orderData.qty = 2;
    component.decreaseVolume();
    expect(component.orderData.qty).toBe(1);
  });

  it('should not decrease volume below 1', () => {
    component.orderData.qty = 1;
    component.decreaseVolume();
    expect(component.orderData.qty).toBe(1);
  });

  it('should place order successfully', () => {
    spyOn(tradeService, 'placeOrder').and.callThrough();
    spyOn(console, 'log');
    component.placeOrder();
    expect(tradeService.placeOrder).toHaveBeenCalledWith(component.orderData);
    expect(console.log).toHaveBeenCalledWith('Order placed successfully:', {
      success: true,
    });
  });

  it('should handle error when placing order', () => {
    spyOn(tradeService, 'placeOrder').and.returnValue(
      of(new Error('Error placing order'))
    );
    spyOn(console, 'error');
    component.placeOrder();
    expect(tradeService.placeOrder).toHaveBeenCalledWith(component.orderData);
    expect(console.error).toHaveBeenCalledWith(
      'Error placing order:',
      jasmine.any(Error)
    );
  });
});
