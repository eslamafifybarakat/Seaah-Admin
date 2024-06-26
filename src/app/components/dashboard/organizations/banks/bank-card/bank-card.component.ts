import { ConfirmDeleteComponent } from './../../../../../shared/components/confirm-delete/confirm-delete.component';
import { Component, Inject, Input, Output, PLATFORM_ID, EventEmitter } from '@angular/core';
import { PublicService } from './../../../../../services/generic/public.service';
import { keys } from '../../../../../shared/configs/localstorage-key';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule],
  selector: 'bank-card',
  templateUrl: './bank-card.component.html',
  styleUrls: ['./bank-card.component.scss']
})
export class BankCardComponent {
  @Input() item: any;
  currentLanguage: string;

  @Output() itemAddUserHandler: EventEmitter<any> = new EventEmitter();
  @Output() itemDetailsHandler: EventEmitter<any> = new EventEmitter();
  @Output() editItemHandler: EventEmitter<any> = new EventEmitter();
  @Output() deleteItemHandler: EventEmitter<any> = new EventEmitter();
  @Output() settingHandler: EventEmitter<any> = new EventEmitter();
  @Output() enableConfirmedByShowInput: boolean = false;
  @Output() enableConfirmDeleteDialog: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialogService: DialogService,
    private publicService: PublicService,
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = window?.localStorage?.getItem(keys?.language);
    }
  }
  addUser(item: any): void {
    this.itemAddUserHandler.emit(item);
  }
  itemDetails(item: any): void {
    this.itemDetailsHandler.emit(item);
  }
  editItem(item: any): void {
    this.editItemHandler.emit(item);
  }
  deleteItem(item: any): void {
    if (this.enableConfirmDeleteDialog) {
      const ref = this.dialogService.open(ConfirmDeleteComponent, {
        data: {
          name: item['bankName'],
          enableConfirm: this.enableConfirmedByShowInput,
        },
        header: this.publicService?.translateTextFromJson('general.confirm_delete'),
        dismissableMask: false,
        width: '35%'
      });

      ref.onClose.subscribe((res: any) => {
        if (res?.confirmed) {
          this.deleteItemHandler?.emit({ item: item, confirmed: res?.confirmed });
        }
      });
    } else {
      this.deleteItemHandler?.emit({ item: item, confirmed: true });
    }
  }
  settingHandlerEmit(item: any): void {
    this.settingHandler.emit({ item: item });
  }
}
