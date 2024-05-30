// Modules
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { UploadMultiFilesComponent } from '../../../../../shared/components/upload-files/upload-multi-files/upload-multi-files.component';
import { DynamicSvgComponent } from './../../../../../shared/components/icons/dynamic-svg/dynamic-svg.component';
import { SkeletonComponent } from '../../../../../shared/skeleton/skeleton/skeleton.component';

//Services
import { LocalizationLanguageService } from '../../../../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from '../../../../../services/generic/metadata.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { BanksService } from '../../../services/banks.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription, catchError, tap } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { OrgnizationUsersComponent } from '../../../users/orgnization-users/orgnization-users.component';
import { AddEditUsersComponent } from '../../../users/add-edit-users/add-edit-users.component';
import { AddEditSchoolComponent } from '../add-edit-school/add-edit-school.component';
import { SchoolsService } from '../../../services/schools.service';
import { SeaahPrecentageModalComponent } from '../schools-list/seaah-precentage-modal/seaah-precentage-modal.component';

@Component({
  selector: 'app-school-details',
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    TranslateModule,
    CalendarModule,
    CommonModule,
    RouterModule,
    FormsModule,

    // Components
    UploadMultiFilesComponent,
    DynamicSvgComponent,
    OrgnizationUsersComponent,
    SkeletonComponent,
    // RecordsComponent
  ],
  templateUrl: './school-details.component.html',
  styleUrls: ['./school-details.component.scss']
})
export class SchoolDetailsComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;
  dataStyleType: string = 'list';

  schoolId: number;
  isLoadingSchoolData: boolean = false;
  organizationData: any;

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
      startTime: [null, {
        validators: [
          Validators.required]
      }],
      endTime: [null, {
        validators: [
          Validators.required]
      }],
      installmentWays: [null, {
        validators: [
          Validators.required]
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
    private metadataService: MetadataService,
    private activatedRoute: ActivatedRoute,
    private schoolsService: SchoolsService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private banksService: BanksService,
    private fb: FormBuilder
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.loadPageData();
  }
  loadPageData(): void {
    this.updateMetaTagsForSEO();
    this.activatedRoute.params.subscribe((params) => {
      this.schoolId = params['id'];
      if (this.schoolId) {
        this.getSchoolById(this.schoolId);
      }
    });
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'تفاصيل المدرسة | سعة',
      description: 'تفاصيل المدرسة | سعة',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  changeDateStyle(type: string): void {
    this.dataStyleType = type;
  }

  // Start Get School By Id
  getSchoolById(id: number | string): void {
    this.isLoadingSchoolData = true;
    let subscribeGetSchool: Subscription = this.schoolsService?.getSchoolById(id).pipe(
      tap((res: any) => this.handleGetSchoolSuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeGetBank())
    ).subscribe();
    this.subscriptions.push(subscribeGetSchool);
  }
  private handleGetSchoolSuccess(response: any): void {
    if (response?.status == 200) {
      this.organizationData = response.data;
      let nameBbj: any = JSON.parse(this.organizationData?.name || '{}');
      this.organizationData['schoolName'] = nameBbj[this.currentLanguage];
      let addressBbj: any = JSON.parse(this.organizationData?.location || '{}');
      this.organizationData['addressName'] = addressBbj[this.currentLanguage];
      this.organizationData['usersCount'] = this.organizationData?.users?.length > 0 ? this.organizationData?.users?.length : '0';
      // this.organizationData['educational_level'] = {
      //   id: 1,
      //   title: this.publicService.translateTextFromJson('general.primaryStage')
      // };
      // this.organizationData['educational_level_name'] = this.organizationData['educational_level']['title'];
      // this.organizationData['region'] = 'region';
      // this.organizationData['city'] = 'city';
      // this.organizationData['commercial_registration_no'] = '0229898989';
      // this.organizationData['website'] = 'website';
      // this.organizationData['email'] = 'email88@gmail.com';
      // this.organizationData['communication_phone'] = '109838388';
      this.patchValue();
    } else {
      this.handleError(response?.message);
    }
  }
  private finalizeGetBank(): void {
    this.isLoadingSchoolData = false;
  }
  // End Get School By Id

  // Start Patch Values
  patchValue(): void {
    let installmentWaysData: any = this.organizationData?.installment_ways;
    this.organizationForm.patchValue({
      name: this.organizationData['schoolName'],
      location: this.organizationData['addressName'].split(',')[0],
      startTime: this.convertTime(this.organizationData?.start_time),
      endTime: this.convertTime(this.organizationData?.end_time),
      installmentWays: installmentWaysData,
      educationalLevel: this.organizationData?.educational_level,
      region: this.organizationData['addressName'].split(',')[1],
      city: this.organizationData['addressName'].split(',')[2],
      commercialRegistrationNo: this.organizationData?.commercial_register,
      website: this.organizationData?.website_url,
      email: this.organizationData?.contact_email,
      communicationPhone: this.organizationData?.contact_number,
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
  // End Patch Values

  // Edit Bank
  editItem(): void {
    const ref = this.dialogService?.open(AddEditSchoolComponent, {
      data: {
        item: this.organizationData,
        type: 'edit',
      },
      header: this.publicService?.translateTextFromJson('dashboard.schools.editSchool'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getSchoolById(this.schoolId);
      }
    });
  }

  // Start Delete Bank User Functions
  deleteBankUser(event: any): void {
    console.log(event);
  }
  // End Delete Bank User Functions

  // Start Add User Modal
  addUser(event: any): void {
    const ref: any = this.dialogService?.open(AddEditUsersComponent, {
      data: {
        type: 'add',
        organizationData: this.organizationData
      },
      header: this.publicService?.translateTextFromJson('dashboard.users.addUser'),
      dismissableMask: false,
      width: '50%',
      styleClass: 'custom-modal',
    });
    ref?.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getSchoolById(this.schoolId);
      }
    });
  }
  // End Add User Modal

  // Start Add Seaah Precentage Modal
  openSeaahPrecentage(item?: any): void {
    const ref: any = this.dialogService?.open(SeaahPrecentageModalComponent, {
      header: this.publicService?.translateTextFromJson('dashboard.banks.seaahPercentage'),
      data: { item: item },
      dismissableMask: false,
      width: '40%',
      styleClass: 'custom-modal',
    });
    ref?.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getSchoolById(this.schoolId)
      }
    });
  }
  // End Add Seaah Precentage Modal

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
