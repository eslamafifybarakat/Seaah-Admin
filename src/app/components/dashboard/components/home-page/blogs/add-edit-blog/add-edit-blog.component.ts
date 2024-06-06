import { patterns } from 'src/app/shared/configs/patterns';
// Modules
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { FileUploadComponent } from '../../../../../../shared/components/upload-files/file-upload/file-upload.component';

//Services
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetaDetails, MetadataService } from 'src/app/services/generic/metadata.service';
import { InstallmentWaysService } from '../../../../services/installment-ways.service';
import { AlertsService } from '../../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../../services/generic/public.service';
import { MaxDigitsDirective } from '../../../../directives/max-digits.directive';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BanksService } from '../../../../services/banks.service';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    MultiSelectModule,
    TranslateModule,
    CalendarModule,
    DropdownModule,
    CommonModule,
    FormsModule,

    // Components
    FileUploadComponent,

    // Directives
    MaxDigitsDirective
  ],
  selector: 'app-add-edit-blog',
  templateUrl: './add-edit-blog.component.html',
  styleUrls: ['./add-edit-blog.component.scss'],
  animations: [
    trigger('messageState', [
      // Define the default states (e.g., 'void' means no state)
      state('void', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      // Define the transition between states
      transition('* <=> *', animate('300ms ease-in'))
    ])
  ]
})
export class AddEditBlogComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  //  Installment Ways Variables
  installmentWays: any[] = [];
  isLoadingInstallmentWays: boolean = false;

  minEndTime: any;

  isEdit: boolean = false;
  bankId: number;
  bankData: any;

  blogFile: any = null;
  blogFileSrc: any;

  blogForm = this.fb?.group(
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
      blogFile: [null, {
        validators: [
          Validators.required]
      }],
    }
  );
  get formControls(): any {
    return this.blogForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private installmentWaysService: InstallmentWaysService,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private banksService: BanksService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.bankData = this.config.data;
    if (this.bankData.type == 'edit') {
      this.isEdit = true;
      this.bankId = this.bankData?.item?.id;
      this.patchValue();
    }
    // this.updateMetaTagsForSEO();
    if (this.isEdit) {
      // Remove the required validator from the blogFile control
      const blogFileControl = this.blogForm.get('blogFile');
      if (blogFileControl) {
        blogFileControl.clearValidators(); // Remove all validators
        blogFileControl.updateValueAndValidity(); // Update control to reflect changes
      }
    }
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'البنوك | سعة',
      description: 'البنوك | سعة',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  patchValue(): void {
    this.blogForm.patchValue({
      title: this.bankData?.item?.title,
      description: this.bankData?.item?.description,
    });
    this.blogFileSrc = this.bankData?.item?.image_path;
  }

  // Upload File
  uploadFile(event: any): void {
    this.blogFile = event.file;
    this.blogForm.get('blogFile').setValue(this.blogFile);
  }
  // Start Time Functions
  onSelectStartTime(event: any): void {
    if (event) {
      this.minEndTime = event;
    }
    this.blogForm?.get('endTime')?.reset();
  }

  // End Time Functions

  // Start Add/Edit Bank
  submit(): void {
    if (this.blogForm?.valid) {
      const formData: any = this.extractFormData();
      this.addEditBank(formData);
    } else {
      this.publicService?.validateAllFormFields(this.blogForm);
    }
  }
  private extractFormData(): any {
    let formData = new FormData();
    formData.append('title[en]', this.blogForm?.value?.title);
    formData.append('title[ar]', this.blogForm?.value?.title);
    formData.append('description[en]', this.blogForm?.value?.description);
    formData.append('description[ar]', this.blogForm?.value?.description);
    if (this.blogForm?.value?.blogFile) {
      formData.append('image', this.blogForm?.value?.blogFile);
    }
    formData.append('type', 'bank');
    if (this.isEdit) {
      formData.append('_method', 'PUT');
    }
    return formData;
  }
  private addEditBank(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditBank: Subscription = this.banksService?.addEditBank(formData, this.bankId ? this.bankId : null).pipe(
      tap(res => this.handleAddEditBankSuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeAddEditBank())
    ).subscribe();
    this.subscriptions.push(subscribeAddEditBank);
  }
  private handleAddEditBankSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  private finalizeAddEditBank(): void {
    this.publicService.showGlobalLoader.next(false);
  }
  // End Add/Edit Bank

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
