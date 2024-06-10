import { SkeletonComponent } from 'src/app/shared/skeleton/skeleton/skeleton.component';
import { patterns } from 'src/app/shared/configs/patterns';
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
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { editorConfig } from '../../../editorConfig';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit-faq',
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    AngularEditorModule,
    TranslateModule,
    CommonModule,
    FormsModule,

    SkeletonComponent,
  ],
  templateUrl: './add-edit-faq.component.html',
  styleUrls: ['./add-edit-faq.component.scss']
})
export class AddEditFaqComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  isEdit: boolean = false;
  faqId: number;
  faqData: any;
  isLoading: boolean = false;

  descriptionValue: any;
  editorConfig: AngularEditorConfig = editorConfig;

  faqForm = this.fb?.group(
    {
      title: ['', {
        validators: [
          Validators.required,
          this.noArabicLettersValidator,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      arTitle: ['', {
        validators: [
          Validators.required,
          this.noEnglishLettersValidator,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      description: ['', {
        validators: [
          Validators.required,
          this.noArabicLettersValidator,
          Validators?.minLength(6)], updateOn: "blur"
      }],
      arDescription: ['', {
        validators: [
          Validators.required,
          this.noEnglishLettersValidator,
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
    // private config: DynamicDialogConfig,
    private activatedRoute: ActivatedRoute,
    private faqService: FAQsService,
    // private ref: DynamicDialogRef,
    private fb: FormBuilder,
    private router: Router,
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.activatedRoute.params.subscribe(((res: any) => {
      this.faqId = res?.id;
      if (this.faqId) {
        this.isEdit = true;
        this.getFaqById();
      }
    }))
    // this.faqData = this.config.data;
    // if (this.faqData.type == 'edit') {
    //   this.isEdit = true;
    //   this.faqId = this.faqData?.item?.id;
    //   this.patchValue();
    // }
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

  // Start Get Faq Data
  getFaqById(): void {
    this.isLoading = true;
    let subscribeGetFaq: Subscription = this.faqService?.getFaqById(this.faqId ? this.faqId : null).pipe(
      tap(res => this.handleFaqSuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.isLoading = false)
    ).subscribe();
    this.subscriptions.push(subscribeGetFaq);
  }
  private handleFaqSuccess(response: any): void {
    this.isLoading = false;
    if (response?.status == 200) {
      this.faqData = response?.data;
      this.patchValue();
    } else {
      this.handleError(response?.message);
    }
  }
  // End Get Faq Data

  patchValue(): void {
    this.faqForm.patchValue({
      title: this.faqData?.title['en'],
      description: this.faqData?.description['en'],
      arTitle: this.faqData?.title['ar'],
      arDescription: this.faqData?.description['ar'],
    });
  }

  // Start arabic english pattern
  noArabicLettersValidator(control: any) {
    const arabicPattern = /[ء-ي]/;
    if (arabicPattern.test(control.value)) {
      return { arabicLetter: true };
    }
    return null;
  }
  noEnglishLettersValidator(control: any) {
    const englishPattern = /[a-zA-z]/;
    if (englishPattern.test(control.value)) {
      return { englishPattern: true };
    }
    return null;
  }
  // Start arabic english pattern

  updateValidation(type: string, event: any) {
    if (type == 'description') {
      this.descriptionValue = event.target.innerText;
    }
  }
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
    formData.append('title[ar]', this.faqForm?.value?.arTitle);
    formData.append('description[en]', this.faqForm?.value?.description);
    formData.append('description[ar]', this.faqForm?.value?.arDescription);
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
      this.router.navigate(['/Dashboard/Home/FAQs/List']);
      // this.ref.close({ listChanged: true, item: response?.data });
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
    this.router.navigate(['/Dashboard/Home/FAQs/List']);
    // this.ref?.close({ listChanged: false });
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

