import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormsModule, Validators, FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription, tap, catchError, finalize } from 'rxjs';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { AlertsService } from 'src/app/services/generic/alerts.service';
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { MetadataService, MetaDetails } from 'src/app/services/generic/metadata.service';
import { PublicService } from 'src/app/services/generic/public.service';
import { patterns } from 'src/app/shared/configs/patterns';
import { MaxDigitsDirective } from 'src/app/directives/max-digits.directive';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-edit-users',
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    RouterModule,
    FormsModule,
    // Directives
    MaxDigitsDirective
  ],
  templateUrl: './add-edit-users.component.html',
  styleUrls: ['./add-edit-users.component.scss']
})
export class AddEditUsersComponent {
  private subscriptions: Subscription[] = [];

  currentLanguage: string;
  isEdit: boolean = false;
  modalData: any;

  userForm = this.fb.group({
    name: ['', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)], updateOn: 'blur' }],
    nationalIdentify: ['', { validators: [Validators.required, Validators.pattern(patterns?.nationalIdentity)], updateOn: 'blur' }],// ensures only numeric values
    phone: ['', { validators: [Validators.required, Validators.pattern(patterns?.phone)], updateOn: 'blur' }],// ensures only numeric values
    email: ['', { validators: [Validators.required, Validators.pattern(patterns?.email)], updateOn: 'blur' }],
  });
  get formControls(): any {
    return this.userForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    private dialogService: DialogService,
    private config: DynamicDialogConfig,
    public publicService: PublicService,
    private authService: AuthService,
    private ref: DynamicDialogRef,
    private location: Location,
    private fb: FormBuilder,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    // this.updateMetaTagsForSEO();
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.modalData = this.config.data;
    console.log(this.modalData);

    // if (this.modalData.type == 'edit') {
    //   this.isEdit = true;
    //   this.bankId = this.bankData?.item?.id;
    //   this.patchValue();
    // }
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'مستخدم  | سعة',
      description: 'مستخدم  | سعة',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  // Start User Functions
  submitNow(): void {
    if (this.userForm?.valid) {
      this.publicService.showGlobalLoader.next(true);
      const data: any = this.excuteDataForm();
      //Send Request to login
      let registerSubscription: Subscription = this.authService?.addUser(data)?.pipe(
        tap(res => this.handleSuccessUser(res)),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeUser())
      ).subscribe();
      this.subscriptions.push(registerSubscription);
    } else {
      this.publicService.validateAllFormFields(this.userForm);
    }
  }
  private finalizeUser(): void {
    this.publicService.showGlobalLoader.next(false);
  }
  private excuteDataForm(): any {
    let data: any = {
      name: this.userForm?.value?.name,
      phone: this.userForm?.value?.phone?.toString(),
      iqama_No: this.userForm?.value?.nationalIdentify,
      email: this.userForm?.value?.email,
      type: this.modalData?.organizationData?.type,
      source_register: 'web',
      type_coming_otp: 'email',
      password: '123456',
      organization_id: this.modalData?.organizationData?.id
    };
    return data;
  }
  private handleSuccessUser(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200) {
      this.ref.close({ listChanged: true, item: response?.data });
      this.handleSuccess(response?.message);
    } else {
      this.handleError(response?.message);
    }
  }
  // End User Functions

  back(): void {
    this.location.back();
  }

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
    this.publicService.showGlobalLoader.next(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
