import { SkeletonComponent } from 'src/app/shared/skeleton/skeleton/skeleton.component';
import { BlogsService } from 'src/app/components/dashboard/services/blogs.service';
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
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { editorConfig } from '../../../editorConfig';

@Component({
  standalone: true,
  imports: [
    // Modules
    ReactiveFormsModule,
    AngularEditorModule,
    MultiSelectModule,
    TranslateModule,
    CalendarModule,
    DropdownModule,
    CommonModule,
    FormsModule,

    // Components
    FileUploadComponent,
    SkeletonComponent,

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
  blogId: number;
  blogData: any;
  isLoading: boolean = false;

  blogFile: any = null;
  blogFileSrc: any;

  blogForm = this.fb?.group(
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
      blogFile: [null, {
        validators: [
          Validators.required]
      }],
    }
  );
  get formControls(): any {
    return this.blogForm?.controls;
  }

  descriptionValue: any;
  editorConfig: AngularEditorConfig = editorConfig;

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private activatedRoute: ActivatedRoute,
    private alertsService: AlertsService,
    public publicService: PublicService,
    // private config: DynamicDialogConfig,
    private blogsService: BlogsService,
    // private ref: DynamicDialogRef,
    private fb: FormBuilder,
    private router: Router,
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.activatedRoute.params.subscribe(((res: any) => {
      this.blogId = res?.id;
      if (this.blogId) {
        this.isEdit = true;
        this.getBlogById();
      }
    }))
    // this.blogData = this.config.data;
    // if (this.blogData.type == 'edit') {
    //   this.isEdit = true;
    //   this.blogId = this.blogData?.item?.id;
    //   this.patchValue();
    // }
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

  // Start Get Blog Data
  getBlogById(): void {
    this.isLoading = true;
    let subscribeGetBlog: Subscription = this.blogsService?.getBlogById(this.blogId ? this.blogId : null).pipe(
      tap(res => this.handleBlogSuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.isLoading = false)
    ).subscribe();
    this.subscriptions.push(subscribeGetBlog);
  }
  private handleBlogSuccess(response: any): void {
    this.isLoading = false;
    if (response?.status == 200) {
      this.blogData = response?.data;
      this.patchValue();
    } else {
      this.handleError(response?.message);
    }
  }
  // End Get Blog Data

  patchValue(): void {
    this.blogForm.patchValue({
      title: this.blogData?.title['en'],
      description: this.blogData?.description['en'],
      arTitle: this.blogData?.title['ar'],
      arDescription: this.blogData?.description['ar'],
    });
    this.blogFileSrc = this.blogData?.image_path;
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
    formData.append('title[ar]', this.blogForm?.value?.arTitle);
    formData.append('description[en]', this.blogForm?.value?.description);
    formData.append('description[ar]', this.blogForm?.value?.arDescription);
    if (this.blogForm?.value?.blogFile) {
      formData.append('image', this.blogForm?.value?.blogFile);
    }
    if (this.isEdit) {
      formData.append('_method', 'PUT');
    }
    return formData;
  }
  private addEditBank(formData: any): void {
    this.publicService?.showGlobalLoader?.next(true);
    let subscribeAddEditBank: Subscription = this.blogsService?.addEditBlog(formData, this.blogId ? this.blogId : null).pipe(
      tap(res => this.handleAddEditBankSuccess(res)),
      catchError(err => this.handleError(err)),
      finalize(() => this.finalizeAddEditBank())
    ).subscribe();
    this.subscriptions.push(subscribeAddEditBank);
  }
  private handleAddEditBankSuccess(response: any): void {
    this.publicService?.showGlobalLoader?.next(false);
    if (response?.status == 200) {
      this.router.navigate(['/Dashboard/Home/Blogs/List']);
      // this.ref.close({ listChanged: true, item: response?.data });
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
    this.router.navigate(['/Dashboard/Home/Blogs/List']);
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
