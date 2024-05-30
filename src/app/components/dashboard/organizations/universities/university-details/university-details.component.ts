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
import { SchoolsService } from '../../../services/schools.service';
import { AddEditUsersComponent } from '../../../users/add-edit-users/add-edit-users.component';
import { AddEditUniversityComponent } from '../add-edit-university/add-edit-university.component';
import { UniversitiesService } from '../../../services/universities.service';
import { SeaahPrecentageModalComponent } from '../../schools/schools-list/seaah-precentage-modal/seaah-precentage-modal.component';

@Component({
  selector: 'app-university-details',
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
  templateUrl: './university-details.component.html',
  styleUrls: ['./university-details.component.scss']
})
export class UniversityDetailsComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;
  dataStyleType: string = 'list';

  bankId: number;
  isLoadingUniversityData: boolean = false;
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
      installmentWays: [null, {
        validators: [
          Validators.required]
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
    private universitiesService: UniversitiesService,
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
      this.bankId = params['id'];
      if (this.bankId) {
        this.getUniversityById(this.bankId);
      }
    });
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'تفاصيل الجامعة | سعة',
      description: 'تفاصيل الجامعة | سعة',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  changeDateStyle(type: string): void {
    this.dataStyleType = type;
  }

  // Start Get University By Id
  getUniversityById(id: number | string): void {
    this.isLoadingUniversityData = true;
    let subscribeGetUniversity: Subscription = this.universitiesService?.getUniversityById(id).pipe(
      tap((res: any) => this.handleGetUniversitySuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeGetUniversity())
    ).subscribe();
    this.subscriptions.push(subscribeGetUniversity);
  }
  private handleGetUniversitySuccess(response: any): void {
    if (response?.status == 200) {
      this.organizationData = response.data;
      let nameBbj: any = JSON.parse(this.organizationData?.name || '{}');
      this.organizationData['universityName'] = nameBbj[this.currentLanguage];
      let addressBbj: any = JSON.parse(this.organizationData?.location || '{}');
      this.organizationData['addressName'] = addressBbj[this.currentLanguage];
      this.organizationData['usersCount'] = this.organizationData?.users?.length > 0 ? this.organizationData?.users?.length : '0';
      this.patchValue();
    } else {
      this.handleError(response?.message);
    }
  }
  private finalizeGetUniversity(): void {
    this.isLoadingUniversityData = false;
  }
  // End Get University By Id

  // Start Patch Values
  patchValue(): void {
    let installmentWaysData: any = this.organizationData?.installment_ways;
    this.organizationForm.patchValue({
      name: this.organizationData['universityName'],
      location: this.organizationData['addressName'],
      startTime: this.convertTime(this.organizationData?.start_time),
      endTime: this.convertTime(this.organizationData?.end_time),
      installmentWays: installmentWaysData,
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

  // Edit University
  editItem(): void {
    const ref = this.dialogService?.open(AddEditUniversityComponent, {
      data: {
        item: this.organizationData,
        type: 'edit',
      },
      header: this.publicService?.translateTextFromJson('dashboard.universities.editUniversity'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getUniversityById(this.bankId);
      }
    });
  }

  // Start Delete University User Functions
  deleteBankUser(event: any): void {
    console.log(event);
  }
  // End Delete University User Functions

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
        this.getUniversityById(this.bankId);
      }
    });
  }
  // End Add User Modal
  // Start Add Seaah Precentage Modal
  openSeaahPrecentage(item: any): void {
    const ref: any = this.dialogService?.open(SeaahPrecentageModalComponent, {
      header: this.publicService?.translateTextFromJson('dashboard.banks.seaahPercentageFromUniversity'),
      data: { item: item },
      dismissableMask: false,
      width: '40%',
      styleClass: 'custom-modal',
    });
    ref?.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
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
