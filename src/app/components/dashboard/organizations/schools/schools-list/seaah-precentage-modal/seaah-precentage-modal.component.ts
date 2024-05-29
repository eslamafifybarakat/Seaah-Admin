import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SchoolsService } from './../../../../services/schools.service';
import { AlertsService } from 'src/app/services/generic/alerts.service';
import { PublicService } from 'src/app/services/generic/public.service';
import { Subscription, catchError, finalize, tap } from 'rxjs';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, CommonModule, InputNumberModule],
  selector: 'app-seaah-precentage-modal',
  templateUrl: './seaah-precentage-modal.component.html',
  styleUrls: ['./seaah-precentage-modal.component.scss']
})
export class SeaahPrecentageModalComponent {
  private subscriptions: Subscription[] = [];
  id: number;
  bankForm = this.fb?.group(
    {
      seaahPercentage: [null, {
        validators: [
          Validators.required], updateOn: "blur"
      }],
    });
  get formControls(): any {
    return this.bankForm?.controls;
  }
  constructor(
    private schoolsService: SchoolsService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    let data = this.config.data?.item;
    if (data) {
      this.bankForm?.patchValue({
        seaahPercentage: data?.percentage_seah_from_school
      })
    }
    this.id = data.id;
  }

  // Start Add Bank Precentage
  submit(): void {
    if (this.bankForm?.valid) {
      const formData: any = this.extractFormData();
      this.addSeaahPrecentage(formData);
    } else {
      this.publicService?.validateAllFormFields(this.bankForm);
    }
  }
  private extractFormData(): any {
    let formData = new FormData();
    formData.append('percentage_seah_from_school', this.bankForm?.value?.seaahPercentage);
    return formData;
  }
  private addSeaahPrecentage(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddBankPrecentage: Subscription = this.schoolsService?.addSeaahPrecentage(formData, this.id).pipe(
      tap(res => this.handleAddSeaahPrecentageSuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeAddSeaahPrecentage())
    ).subscribe();
    this.subscriptions.push(subscribeAddBankPrecentage);
  }
  private handleAddSeaahPrecentageSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  private finalizeAddSeaahPrecentage(): void {
    this.publicService.showGlobalLoader.next(false);
  }
  // End Add Bank Precentage

  cancel(): void {
    this.ref?.close({ listChanged: false });
  }

  /* --- Handle api requests messages --- */
  private handleSuccess(msg: string | null): any {
    this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'succss');
  }
  private handleError(err: string | null): any {
    this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'), 'error');
  }
  private setMessage(message: string, type?: string | null): void {
    // this.alertsService.openToast(type, type, message);
    this.alertsService.openToast('success', 'success', 'success');
    this.cancel();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

}
