// Modules
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

// Components
import { UploadMultiFilesComponent } from '../../../../../shared/components/upload-files/upload-multi-files/upload-multi-files.component';
import { DynamicSvgComponent } from './../../../../../shared/components/icons/dynamic-svg/dynamic-svg.component';
import { SkeletonComponent } from '../../../../../shared/skeleton/skeleton/skeleton.component';
import { AddEditBankComponent } from '../add-edit-bank/add-edit-bank.component';

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

@Component({
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
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string;
  dataStyleType: string = 'list';

  bankId: number;
  isLoadingBankData: boolean = false;
  bankData: any;

  bankForm = this.fb?.group(
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
      communicationEmail: ['', {
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
    return this.bankForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private activatedRoute: ActivatedRoute,
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
      this.bankId = params['id'];
      if (this.bankId) {
        this.getBankById(this.bankId);
      }
    });
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'تفاصيل البنك',
      description: 'تفاصيل البنك',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  changeDateStyle(type: string): void {
    this.dataStyleType = type;
  }

  // Start Get Bank By Id
  getBankById(id: number | string): void {
    this.isLoadingBankData = true;
    let subscribeGetBank: Subscription = this.banksService?.getBankById(id).pipe(
      tap((res: any) => this.handleGetBankSuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeGetBank())
    ).subscribe();
    this.subscriptions.push(subscribeGetBank);
  }
  private handleGetBankSuccess(response: any): void {
    if (response?.status == 200) {
      this.bankData = response.data;
      let nameBbj: any = JSON.parse(this.bankData?.name || '{}');
      this.bankData['bankName'] = nameBbj[this.currentLanguage];
      let addressBbj: any = JSON.parse(this.bankData?.location || '{}');
      this.bankData['addressName'] = addressBbj[this.currentLanguage];
      this.bankData['communication_email'] = 'email33@gmail.com';
      this.bankData['communication_phone'] = '01233933888';
      // installment ways
      this.bankData?.installment_ways?.forEach((element: any) => {
        // let nameObj: any = JSON.parse(element?.name || '{}');
        // element['name'] = nameObj[this.currentLanguage];
        element['name'] = element['name'];
      });
      this.bankData['usersCount'] = this.bankData?.users?.length > 0 ? this.bankData?.users?.length : '0';
      this.patchValue();
    } else {
      this.handleError(response?.message);
    }
  }
  private finalizeGetBank(): void {
    this.isLoadingBankData = false;
  }
  // End Get Bank By Id

  // Start Patch Values
  patchValue(): void {
    let installmentWaysData: any = this.bankData?.installment_ways;
    this.bankForm.patchValue({
      name: this.bankData['bankName'],
      location: this.bankData['addressName'],
      communicationEmail: this.bankData['communication_email'],
      communicationPhone: this.bankData['communication_phone'],
      startTime: this.convertTime(this.bankData?.start_time),
      endTime: this.convertTime(this.bankData?.end_time),
      installmentWays: installmentWaysData,
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
    const ref = this.dialogService?.open(AddEditBankComponent, {
      data: {
        item: this.bankData,
        type: 'edit',
      },
      header: this.publicService?.translateTextFromJson('dashboard.banks.editBank'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getBankById(this.bankId);
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
        organizationData: this.bankData
      },
      header: this.publicService?.translateTextFromJson('dashboard.users.addUser'),
      dismissableMask: false,
      width: '50%',
      styleClass: 'custom-modal',
    });
    ref?.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getBankById(this.bankId);
      }
    });
  }
  // End Add User Modal


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
