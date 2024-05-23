// Components
import { LanguageSelectorComponent } from './../../../shared/components/language-selector/language-selector.component';
import { VerificationCodeComponent } from '../verification-code/verification-code.component';

// Services
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { CurrentUserInformationApiResponse, LoginApiResponse } from 'src/app/interfaces/auth';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetaDetails, MetadataService } from 'src/app/services/generic/metadata.service';
import { MaxDigitsDirective } from '../../dashboard/directives/max-digits.directive';
import { AuthService } from '../../../services/authentication/auth.service';
import { AlertsService } from './../../../services/generic/alerts.service';
import { PublicService } from './../../../services/generic/public.service';
import { Subscription, catchError, finalize, tap } from 'rxjs';
import { patterns } from 'src/app/shared/configs/patterns';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { PasswordModule } from 'primeng/password';
@Component({
  standalone: true,
  imports: [
    // Components
    LanguageSelectorComponent,

    // Modules
    ReactiveFormsModule,
    TranslateModule,
    PasswordModule,
    CommonModule,
    RouterModule,
    FormsModule,

    // Directives
    MaxDigitsDirective
  ],
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private subscriptions: Subscription[] = [];

  loginForm = this.fb.group({
    email: ['', { validators: [Validators.required, Validators.pattern(patterns.email)], updateOn: 'blur' }],
    password: ['', { validators: Validators.required, updateOn: 'blur' }],
    remember: [false, []],
  });
  get formControls(): any {
    return this.loginForm?.controls;
  }

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private alertsService: AlertsService,
    public publicService: PublicService,
    private dialogService: DialogService,
    private authService: AuthService,
    private location: Location,
    private fb: FormBuilder,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.updateMetaTagsForSEO();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'تسجيل الدخول | سعة',
      description: 'تسجيل الدخول | سعة',
      image: './assets/images/logo/logo-favicon.svg'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

 // Start Login Functions
 loginNow(): void {
  if (this.loginForm?.valid) {
    this.publicService.showGlobalLoader.next(true);
    let formData = new FormData();
    formData.append('email', this.loginForm?.value?.email);
    formData.append('password', this.loginForm?.value?.password);
    //Send Request to login
    let loginSubscription: Subscription = this.authService?.login(formData)?.pipe(
      tap((res: LoginApiResponse) => this.handleSuccessLoggedIn(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeLogin())
    ).subscribe();
    this.subscriptions.push(loginSubscription);
  } else {
    this.publicService.validateAllFormFields(this.loginForm);
  }
}
private handleSuccessLoggedIn(res: LoginApiResponse): void {
  if (res?.status == 200) {
    this.authService.saveUserLoginData(res?.data);
    this.authService.saveToken(res?.data?.user_info?.token);
    this.getCurrentUserInformation();
  } else {
    this.handleError(res?.message);
  }
}
private finalizeLogin(): void {

}
// End Login Functions

// Start Current User Information Functions
private getCurrentUserInformation(): void {
  let currentUserInformationSubscription: Subscription = this.authService?.getCurrentUserInformation()?.pipe(
    tap((res: CurrentUserInformationApiResponse) => this.handleSuccessCuurentUserInformation(res)),
    catchError(err => this.handleError(err)),
    finalize(() => this.finalizeCurrentUserInformation())
  ).subscribe();
  this.subscriptions.push(currentUserInformationSubscription);
}
private handleSuccessCuurentUserInformation(res: CurrentUserInformationApiResponse): void {
  if (res?.status == 200) {
    this.authService.saveCurrentUserInformation(res?.data?.data);
    this.publicService.showGlobalLoader.next(false);
    this.router.navigate(['/Dashboard']);
  } else {
    this.handleError(res?.message);
  }
}
private finalizeCurrentUserInformation(): void {

}
// End Current User Information Functions

  back(): void {
    this.location.back();
  }

  /* --- Handle api requests messages --- */
  private handleSuccess(msg: string | null): any {
    this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'success');
  }
  private handleError(err: string | null): any {
    this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'), 'error');
  }
  private setMessage(message: string, type?: string): void {
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
