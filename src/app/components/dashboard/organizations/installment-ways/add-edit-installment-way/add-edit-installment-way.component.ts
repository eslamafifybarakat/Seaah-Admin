// Modules
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { FileUploadComponent } from '../../../../../shared/components/upload-files/file-upload/file-upload.component';

//Services
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetaDetails, MetadataService } from 'src/app/services/generic/metadata.service';
import { InstallmentWaysService } from '../../../services/installment-ways.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { tap, catchError } from 'rxjs/operators';
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
    DropdownModule,
    CommonModule,
    FormsModule,

    // Components
    FileUploadComponent
  ],
  selector: 'app-add-edit-installment-way',
  templateUrl: './add-edit-installment-way.component.html',
  styleUrls: ['./add-edit-installment-way.component.scss']
})
export class AddEditInstallmentWayComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  isEdit: boolean = false;
  installmentWayId: number;
  installmentWayData: any;

  periodList: any = [
    { id: 1, value: '1', name: '1' },
    { id: 2, value: '2', name: '2' },
    { id: 3, value: '3', name: '3' },
    { id: 4, value: '4', name: '4' },
    { id: 5, value: '5', name: '5' },
    { id: 6, value: '6', name: '6' },
    { id: 7, value: '7', name: '7' },
    { id: 8, value: '8', name: '8' },
    { id: 9, value: '9', name: '9' },
    { id: 10, value: '10', name: '10' },
    { id: 11, value: '11', name: '11' },
    { id: 12, value: '12', name: '12' },
  ];

  installmentWaysForm = this.fb?.group(
    {
      name: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      description: ['', {
        validators: [
          Validators.required, Validators.minLength(6)], updateOn: "blur"
      }],
      period: [null, { validators: [Validators.required] }],
    }
  );
  get formControls(): any {
    return this.installmentWaysForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private installmentWaysService: InstallmentWaysService,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.installmentWayData = this.config.data;
    if (this.installmentWayData.type == 'edit') {
      this.isEdit = true;
      this.installmentWayId = this.installmentWayData?.item?.id;
      this.patchValue();
    }
    // this.updateMetaTagsForSEO();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'إضافة طرق تقسيط | سعة',
      description: 'إضافة طرق تقسيط | سعة',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  patchValue(): void {
    this.periodList?.forEach((element: any) => {
      if (element?.value == this.installmentWayData?.item?.period) {
        this.installmentWaysForm.patchValue({
          period: element
        });
      }
    });
    this.installmentWaysForm.patchValue({
      name: this.installmentWayData?.item?.installmentWaysName,
      description: this.installmentWayData?.item?.installmentWaysDetails,
    });
  }

  // Start Add New Client
  submit(): void {
    if (this.installmentWaysForm?.valid) {
      const formData: any = this.extractFormData();
      this.addEditInstallmentWay(formData);
    } else {
      this.publicService?.validateAllFormFields(this.installmentWaysForm);
    }
  }
  private extractFormData(): any {
    let formData = new FormData();
    let formInfo: any = this.installmentWaysForm?.value;
    formData.append('name[en]', formInfo?.name);
    formData.append('name[ar]', formInfo?.name);
    formData.append('description[en]', formInfo?.description);
    formData.append('description[ar]', formInfo?.description);
    formData.append('period', formInfo?.period?.value);
    if (this.isEdit) {
      formData.append('_method', 'PUT');
    }
    return formData;
  }
  private addEditInstallmentWay(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditInstallmentWay: Subscription = this.installmentWaysService?.addEditInstallmentWay(formData, this.installmentWayId ? this.installmentWayId : null).pipe(
      tap((res: any) => this.handleAddInstallmentWaySuccess(res)),
      catchError(err => this.handleError(err))
    ).subscribe();
    this.subscriptions.push(subscribeAddEditInstallmentWay);
  }
  private handleAddInstallmentWaySuccess(response: any): void {
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  // End Add New Client

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
    this.publicService.showGlobalLoader.next(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
