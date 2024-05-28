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
import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-school',
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
  templateUrl: './add-edit-school.component.html',
  styleUrls: ['./add-edit-school.component.scss'],
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
export class AddEditSchoolComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;

  minEndTime: any;

  isEdit: boolean = false;
  schoolId: number;
  schoolData: any;

  organizationFile: any = null;
  organizationFileSrc: any;
  educationalLevels: any = [
    {
      id: 'primary',
      title: this.publicService.translateTextFromJson('general.primaryStage')
    },
    {
      id: 'secondary',
      title: this.publicService.translateTextFromJson('general.middleSchool')
    },
    {
      id: 'hightSchool',
      title: this.publicService.translateTextFromJson('general.highSchool')
    },
  ]

  // Check Record Number Variables
  isLoadingCheckRecordNum: Boolean = false;
  recordNumNotAvailable: Boolean = false;

  organizationForm: any = this.fb?.group(
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
      educationalLevel: [null, {
        validators: [
          Validators.required]
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
    private banksService: BanksService,
    private cdr: ChangeDetectorRef,
    private ref: DynamicDialogRef,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.schoolData = this.config.data;
    if (this.schoolData.type == 'edit') {
      this.isEdit = true;
      this.schoolId = this.schoolData?.item?.id;
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
      title: 'المدارس | سعة',
      description: 'المدارس | سعة',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }
  patchValue(): void {
    this.organizationForm.patchValue({
      name: this.schoolData?.item?.schoolName,
      location: this.schoolData?.item?.addressName,
      region: this.schoolData?.item?.region,
      city: this.schoolData?.item?.city,
      commercialRegistrationNo: this.schoolData?.item?.commercial_register,
      website: this.schoolData?.item?.website_url,
      email: this.schoolData?.item?.contact_email,
      communicationPhone: this.schoolData?.item?.contact_number,
      startTime: this.convertTime(this.schoolData?.item?.start_time),
      endTime: this.convertTime(this.schoolData?.item?.end_time),
    });
    this.organizationFileSrc = this.schoolData?.item?.image_path;
    this.educationalLevels ? this.educationalLevels.forEach((element: any) => {
      if (element.id == this.schoolData?.item.educational_level) {
        this.organizationForm.patchValue({
          educationalLevel: element,
        });
      }
    }) : '';
    // this.checkRecordNumAvailable();
  }
  convertTime(date: any): any {
    const timeString = date;
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const dateTimeString = `${dateString}T${timeString}`;
    const time: any = new Date(dateTimeString);
    return time;
  }

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
    this.cdr.detectChanges();
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

  // Start Add/Edit Bank
  submit(): void {
    if (this.organizationForm?.valid) {
      const formData: any = this.extractFormData();
      this.addEditBank(formData);
    } else {
      this.publicService?.validateAllFormFields(this.organizationForm);
    }
  }
  private extractFormData(): any {
    let formData: any = new FormData();
    // let installmentWays: any = this.organizationForm.value.installmentWays;
    // let installmentWaysIds: any = [];
    // installmentWays.forEach(element => {
    //   installmentWaysIds.push(element.id);
    // });
    let startTime: any = this.organizationForm?.value?.startTime;
    let endTime: any = this.organizationForm?.value?.endTime;
    let location: any = this.organizationForm?.value?.location;
    let region: any = this.organizationForm?.value?.region;
    let city: any = this.organizationForm?.value?.city;
    formData.append('name[en]', this.organizationForm?.value?.name);
    formData.append('name[ar]', this.organizationForm?.value?.name);
    formData.append('location[en]', `${location}, ${region}, ${city}`);
    formData.append('location[ar]', `${location}, ${region}, ${city}`);
    formData.append('educational_level', this.organizationForm.value.educationalLevel['id']);
    // formData.append('region', this.organizationForm?.value?.region);
    // formData.append('city', this.organizationForm?.value?.city);
    formData.append('commercial_register', this.organizationForm?.value?.commercialRegistrationNo);
    formData.append('website_url', this.organizationForm?.value?.website);
    formData.append('contact_email', this.organizationForm?.value?.email);
    formData.append('contact_number', this.organizationForm?.value?.communicationPhone);
    // formData.append('start_time', startTime.toLocaleTimeString('en-US', { hour12: false }));
    // formData.append('end_time', endTime.toLocaleTimeString('en-US', { hour12: false }));
    // formData.append('installment_ways', JSON.stringify(installmentWaysIds));
    if (this.organizationForm?.value?.organizationFile) {
      formData.append('image', this.organizationForm?.value?.organizationFile);
    }
    formData.append('type', 'school');
    if (this.isEdit) {
      formData.append('_method', 'PUT');
    }
    return formData;
  }
  private addEditBank(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditBank: Subscription = this.banksService?.addEditBank(formData, this.schoolId ? this.schoolId : null).pipe(
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
