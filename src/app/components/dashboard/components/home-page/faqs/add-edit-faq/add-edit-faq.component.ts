import { FAQsService } from 'src/app/components/dashboard/services/faqs.service';
import { PublicService } from 'src/app/services/generic/public.service';
import { AlertsService } from 'src/app/services/generic/alerts.service';
import { MetadataService, MetaDetails } from 'src/app/services/generic/metadata.service';
import { InstallmentWaysService } from './../../../../services/installment-ways.service';
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, Subscription, tap } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-edit-faq',
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './add-edit-faq.component.html',
  styleUrls: ['./add-edit-faq.component.scss']
})
export class AddEditFaqComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  //  Installment Ways Variables
  installmentWays: any[] = [];
  isLoadingInstallmentWays: boolean = false;

  minEndTime: any;

  isEdit: boolean = false;
  faqId: number;
  faqData: any;

  bankFile: any = null;
  bankFileSrc: any;

  faqForm = this.fb?.group(
    {
      title: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      description: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(6)], updateOn: "blur"
      }],
    }
  );
  get formControls(): any {
    return this.faqForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private installmentWaysService: InstallmentWaysService,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private faqService: FAQsService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.faqData = this.config.data;
    if (this.faqData.type == 'edit') {
      this.isEdit = true;
      this.faqId = this.faqData?.item?.id;
      this.patchValue();
    }
    // this.updateMetaTagsForSEO();
    if (this.isEdit) {
      // Remove the required validator from the bankFile control
      const bankFileControl = this.faqForm.get('bankFile');
      if (bankFileControl) {
        bankFileControl.clearValidators(); // Remove all validators
        bankFileControl.updateValueAndValidity(); // Update control to reflect changes
      }
    }
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'الاسئلة الشائعة | سعة',
      description: 'الاسئلة الشائعة | سعة',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  patchValue(): void {
    this.faqForm.patchValue({
      title: this.faqData?.item?.title,
      description: this.faqData?.item?.description,
    });
  }
  convertTime(date: any): any {
    const timeString = date;
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const dateTimeString = `${dateString}T${timeString}`;
    const time: any = new Date(dateTimeString);
    return time;
  }

  // Start Time Functions
  onSelectStartTime(event: any): void {
    if (event) {
      this.minEndTime = event;
    }
    this.faqForm?.get('endTime')?.reset();
  }
  clearStartTime(): void {
    this.faqForm?.get('endTime')?.reset();
  }
  // End Time Functions

  // Start Add/Edit Faq
  submit(): void {
    if (this.faqForm?.valid) {
      const formData: any = this.extractFormData();
      this.addEditFaq(formData);
    } else {
      this.publicService?.validateAllFormFields(this.faqForm);
    }
  }
  private extractFormData(): any {
    let formData = new FormData();
    formData.append('title[en]', this.faqForm?.value?.title);
    formData.append('title[ar]', this.faqForm?.value?.title);
    formData.append('description[en]', this.faqForm?.value?.description);
    formData.append('description[ar]', this.faqForm?.value?.description);
    if (this.isEdit) {
      formData.append('_method', 'PUT');
    }
    return formData;
  }
  private addEditFaq(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditFaq: Subscription = this.faqService?.addEditFaq(formData, this.faqId ? this.faqId : null).pipe(
      tap(res => this.handleAddEditFaqSuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeAddEditFaq())
    ).subscribe();
    this.subscriptions.push(subscribeAddEditFaq);
  }
  private handleAddEditFaqSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  private finalizeAddEditFaq(): void {
    this.publicService.showGlobalLoader.next(false);
  }
  // End Add/Edit Faq

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
    console.log(message);

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

