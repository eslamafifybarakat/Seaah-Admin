import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/services/generic/alerts.service';
import { PublicService } from 'src/app/services/generic/public.service';
import { BanksService } from './../../../../services/banks.service';
import { Subscription, catchError, finalize, tap } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, CommonModule, InputNumberModule],
  selector: 'app-bank-precentage-modal',
  templateUrl: './bank-precentage-modal.component.html',
  styleUrls: ['./bank-precentage-modal.component.scss']
})
export class BankPrecentageModalComponent {
  private subscriptions: Subscription[] = [];
  id: number;
  bankForm = this.fb?.group(
    {
      bankPercentage: [null, {
        validators: [
          Validators.required], updateOn: "blur"
      }],
    });
  get formControls(): any {
    return this.bankForm?.controls;
  }
  constructor(
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private banksService: BanksService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    let data = this.config.data?.item;
    if (data) {
      this.bankForm?.patchValue({
        bankPercentage: data.percentage_bank_from_seah
      })
    }
    this.id = data.id;
  }

  // Start Add Bank Precentage
  submit(): void {
    if (this.bankForm?.valid) {
      const formData: any = this.extractFormData();
      this.addBankPrecentage(formData);
    } else {
      this.publicService?.validateAllFormFields(this.bankForm);
    }
  }
  private extractFormData(): any {
    let formData = new FormData();
    formData.append('percentage_bank_from_seah', this.bankForm?.value?.bankPercentage);
    formData.append('_method', 'PUT');
    formData.append('type', 'bank');
    return formData;
  }
  private addBankPrecentage(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddBankPrecentage: Subscription = this.banksService?.addBankPrecentage(formData, this.id).pipe(
      tap(res => this.handleAddBankPrecentageSuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeAddBankPrecentage())
    ).subscribe();
    this.subscriptions.push(subscribeAddBankPrecentage);
  }
  private handleAddBankPrecentageSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  private finalizeAddBankPrecentage(): void {
    this.publicService.showGlobalLoader.next(false);
  }
  // End Add Bank Precentage

  cancel(): void {
    this.ref?.close({ listChanged: false });
  }

  /* --- Handle api requests messages --- */
  private handleSuccess(msg: string | null): any {
    this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'success');
  }
  private handleError(err: string | null): any {
    this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'), 'error');
  }
  private setMessage(message: string, type?: string | null): void {
    this.alertsService.openToast(type, type, message);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

}
