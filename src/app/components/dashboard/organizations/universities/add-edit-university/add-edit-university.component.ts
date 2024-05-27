// Modules
import { trigger, state, style, transition, animate } from '@angular/animations';
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
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BanksService } from '../../../services/banks.service';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UniversitiesService } from '../../../services/universities.service';

@Component({
  selector: 'app-add-edit-university',
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
    FileUploadComponent
  ],
  templateUrl: './add-edit-university.component.html',
  styleUrls: ['./add-edit-university.component.scss'],
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
export class AddEditUniversityComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  minEndTime: any;

  isEdit: boolean = false;
  organizationId: number;
  organizationData: any;

  organizationFile: any = null;
  organizationFileSrc: any;

  // Check Record Number Variables
  isLoadingCheckRecordNum: Boolean = false;
  recordNumNotAvailable: Boolean = false;

  organizationForm = this.fb?.group(
    {
      name: ['', {
        validators: [
          Validators.required,
          Validators?.minLength(3)], updateOn: "blur"
      }],
      location: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      region: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      city: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      commercialRegistrationNo: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      website: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      email: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      communicationPhone: ['', {
        validators: [
          Validators.required], updateOn: "blur"
      }],
      startTime: [null, {
        validators: [
        ]
      }],
      endTime: [null, {
        validators: [
        ]
      }],
      organizationFile: [null, {
        validators: [
          Validators.required]
      }],
    }
  );
  get formControls(): any {
    return this.organizationForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private installmentWaysService: InstallmentWaysService,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private config: DynamicDialogConfig,
    private universitiesService: UniversitiesService,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.organizationData = this.config.data;
    if (this.organizationData.type == 'edit') {
      this.isEdit = true;
      this.organizationId = this.organizationData?.item?.id;
      this.patchValue();
    } else {
      // this.getInstallmentWays();
    }
    // this.updateMetaTagsForSEO();
    if (this.isEdit) {
      // Remove the required validator from the organizationFile control
      const organizationFileControl = this.organizationForm.get('organizationFile');
      if (organizationFileControl) {
        organizationFileControl.clearValidators(); // Remove all validators
        organizationFileControl.updateValueAndValidity(); // Update control to reflect changes
      }
    }
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'الجامعات | سعة',
      description: 'الجامعات | سعة',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  patchValue(): void {
    this.organizationForm.patchValue({
      name: this.organizationData?.item?.universityName,
      location: this.organizationData?.item?.addressName,
      region: this.organizationData?.item?.region,
      city: this.organizationData?.item?.city,
      commercialRegistrationNo: this.organizationData?.item?.commercial_registration_no,
      website: this.organizationData?.item?.website,
      email: this.organizationData?.item?.email,
      communicationPhone: this.organizationData?.item?.communication_phone,
      startTime: this.convertTime(this.organizationData?.item?.start_time),
      endTime: this.convertTime(this.organizationData?.item?.end_time),
    });
    this.organizationFileSrc = this.organizationData?.item?.image_path;
    // this.getInstallmentWays();
  }
  convertTime(date: any): any {
    const timeString = date;
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const dateTimeString = `${dateString}T${timeString}`;
    const time: any = new Date(dateTimeString);
    return time;
  }

  // Upload File
  uploadFile(event: any): void {
    this.organizationFile = event.file;
    this.organizationForm.get('organizationFile').setValue(this.organizationFile);
  }
  // Start Time Functions
  onSelectStartTime(event: any): void {
    if (event) {
      this.minEndTime = event;
    }
    this.organizationForm?.get('endTime')?.reset();
  }
  clearStartTime(): void {
    this.organizationForm?.get('endTime')?.reset();
  }
  // End Time Functions

  onKeyUpEvent(): void {
    this.isLoadingCheckRecordNum = false;
  }
  // Start Check If Record Number Unique
  checkRecordNumAvailable(): void {
    if (!this.formControls?.commercialRegistrationNo?.valid) {
      return; // Exit early if Record Number is not valid
    }
    const number: number | string = this.organizationForm?.value?.commercialRegistrationNo;
    const data: any = { number };
    this.isLoadingCheckRecordNum = true;
    let checkRecordNumSubscription: Subscription = this.publicService?.IsRecordNumberAvailable(data).pipe(
      tap(res => this.handleRecordNumResponse(res)),
      catchError(err => this.handleRecordNumError(err))
    ).subscribe();
    this.subscriptions.push(checkRecordNumSubscription);
  }
  private handleRecordNumResponse(res: any): void {
    if (res?.success && res?.result != null) {
      this.recordNumNotAvailable = !res.result;
    } else {
      this.recordNumNotAvailable = false;
      this.handleRecordNumError(res?.message);
    }
    this.isLoadingCheckRecordNum = false;
  }
  private handleRecordNumError(err: any): any {
    this.recordNumNotAvailable = true;
    this.isLoadingCheckRecordNum = false;
    this.handleError(err);
  }
  clearCheckAvailable(type: string): void {
    this.recordNumNotAvailable = false;
  }
  // End Check If Record Number Unique

  // Start Add/Edit University
  submit(): void {
    if (this.organizationForm?.valid) {
      const formData: any = this.extractFormData();
      this.addEditUniversity(formData);
    } else {
      this.publicService?.validateAllFormFields(this.organizationForm);
    }
  }
  private extractFormData(): any {
    let formData = new FormData();
    // let installmentWays: any = this.organizationForm.value.installmentWays;
    // let installmentWaysIds: any = [];
    // installmentWays.forEach(element => {
    //   installmentWaysIds.push(element.id);
    // });
    let startTime: any = this.organizationForm?.value?.startTime;
    let endTime: any = this.organizationForm?.value?.endTime;
    formData.append('name[en]', this.organizationForm?.value?.name);
    formData.append('name[ar]', this.organizationForm?.value?.name);
    formData.append('location[en]', this.organizationForm?.value?.location);
    formData.append('location[ar]', this.organizationForm?.value?.location);
    formData.append('region', this.organizationForm?.value?.region);
    formData.append('city', this.organizationForm?.value?.city);
    formData.append('commercial_registration_no', this.organizationForm?.value?.commercialRegistrationNo);
    formData.append('website', this.organizationForm?.value?.website);
    formData.append('email', this.organizationForm?.value?.email);
    formData.append('communication_phone', this.organizationForm?.value?.communicationPhone);
    formData.append('start_time', startTime.toLocaleTimeString('en-US', { hour12: false }));
    formData.append('end_time', endTime.toLocaleTimeString('en-US', { hour12: false }));
    // formData.append('installment_ways', JSON.stringify(installmentWaysIds));
    if (this.organizationForm?.value?.organizationFile) {
      formData.append('image', this.organizationForm?.value?.organizationFile);
    }
    formData.append('type', 'university');
    if (this.isEdit) {
      formData.append('_method', 'PUT');
    }
    return formData;
  }
  private addEditUniversity(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditUniversity: Subscription = this.universitiesService?.addEditUniversity(formData, this.organizationId ? this.organizationId : null).pipe(
      tap(res => this.handleAddEditUniversitySuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeAddEditUniversity())
    ).subscribe();
    this.subscriptions.push(subscribeAddEditUniversity);
  }
  private handleAddEditUniversitySuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  private finalizeAddEditUniversity(): void {
    this.publicService.showGlobalLoader.next(false);
  }
  // End Add/Edit University

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
