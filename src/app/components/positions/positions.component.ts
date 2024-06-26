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
  selector: 'app-positions',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
})
export class PositionsComponent {
  @Input() positions: any[] = [];
}
