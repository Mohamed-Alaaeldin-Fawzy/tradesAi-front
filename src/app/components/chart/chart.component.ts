import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import {
  createChart,
  IChartApi,
  DeepPartial,
  ChartOptions,
  CandlestickSeriesOptions,
  ISeriesApi,
  ColorType,
} from 'lightweight-charts';
import { format } from 'date-fns';
import { TradeService } from '../../services/trade.service';
import { SelectedInstrumentService } from '../../services/selected-instrument.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: true })
  private chartContainer!: ElementRef<HTMLDivElement>;
  private chart!: IChartApi;
  private candleSeries!: ISeriesApi<'Candlestick'>;
  private subscription!: Subscription;
  data = { routeId: 0, tradableInstrumentId: 0 };
  name = '';
  barData: Array<{
    t: number;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
  }> = [];
  chartInitialized = false;

  constructor(
    private renderer: Renderer2,
    private tradeService: TradeService,
    private selectedInstrumentService: SelectedInstrumentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscription = this.selectedInstrumentService.selectedInstrument$
      .pipe(
        filter(
          (instrument) => !!instrument && instrument.tradableInstrumentId > 0
        )
      )
      .subscribe({
        next: (instrument) => this.handleInstrumentChange(instrument),
        error: (error) => this.toastr.error('Error selecting instrument'),
      });
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  handleInstrumentChange(instrument: any): void {
    this.name = instrument.name;
    this.data.tradableInstrumentId = instrument.tradableInstrumentId;
    this.data.routeId =
      instrument.routes?.find(
        (r: { type: string; id: number }) => r.type === 'INFO'
      )?.id || 0;
    this.getDataBar();
  }

  getDataBar(): void {
    this.tradeService.getDataBarByInstrumentId(this.data).subscribe({
      next: (response) => {
        this.barData = response.data.d.barDetails;
        if (this.chartInitialized) {
          this.updateChartData();
        }
      },
      error: (error) => {
        this.toastr.error('Failed to load data for the selected instrument');
      },
    });
  }

  initializeChart(): void {
    const chartOptions: DeepPartial<ChartOptions> = {
      autoSize: true,
      layout: {
        textColor: '#CCC',
        background: { type: ColorType.Solid, color: '#09090B' },
      },
      grid: {
        vertLines: { color: '#27272A' },
        horzLines: { color: '#27272A' },
      },
    };

    const candlestickSeriesOptions: DeepPartial<CandlestickSeriesOptions> = {
      upColor: '#4CAF50',
      downColor: '#F44336',
      borderDownColor: '#F44336',
      borderUpColor: '#4CAF50',
      wickDownColor: '#F44336',
      wickUpColor: '#4CAF50',
    };

    this.chart = createChart(this.chartContainer.nativeElement, chartOptions);
    this.candleSeries = this.chart.addCandlestickSeries(
      candlestickSeriesOptions
    );
    this.chartInitialized = true;

    if (this.barData.length > 0) {
      this.updateChartData();
    }
  }

  updateChartData(): void {
    const chartData = this.barData.map((bar) => ({
      time: format(new Date(bar.t), 'yyyy-MM-dd'),
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
    }));

    const uniqueChartData = Array.from(
      new Map(chartData.map((item) => [item.time, item])).values()
    );
    uniqueChartData.sort((a, b) => a.time.localeCompare(b.time));

    this.candleSeries.setData(uniqueChartData);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
