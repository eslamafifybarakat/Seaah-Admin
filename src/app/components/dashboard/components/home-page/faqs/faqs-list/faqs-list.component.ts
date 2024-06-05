import { SkeletonComponent } from './../../../../../../shared/skeleton/skeleton/skeleton.component';
// Services
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { MetaDetails, MetadataService } from 'src/app/services/generic/metadata.service';
import { PublicService } from 'src/app/services/generic/public.service';
// Modules
import { AlertsService } from 'src/app/services/generic/alerts.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { FAQsService } from 'src/app/components/dashboard/services/faqs.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AddEditFaqComponent } from '../add-edit-faq/add-edit-faq.component';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-faqs-list',
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    CommonModule,
    SkeletonComponent,
  ],
  templateUrl: './faqs-list.component.html',
  styleUrls: ['./faqs-list.component.scss']
})
export class FaqsListComponent {
  private subscriptions: Subscription[] = [];
  private imageBaseUrl: string = '';
  private metaDetails: MetaDetails | undefined;
  private fullPageUrl: string = '';

  /* --- Start FAQs List Variables --- */
  FAQsList: any = [];
  isLoadingFAQsList: boolean = false;
  faqsCount: number = 0;
  /* --- End FAQs List Variables --- */

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private fAQsService: FAQsService,
    private cdr: ChangeDetectorRef
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.initPageData();
  }
  private initPageData(): void {
    this.updateMetaTagsForSEO();
    // this.imageBaseUrl = environment.imageBaseUrl;
    this.getFAQsList();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'الأسئلة و الإستفسارات',
      description: 'الأسئلة و الإستفسارات'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  /* --- Start FAQs List Functions --- */
  getFAQsList(preventLoading?: boolean): void {
    if (!preventLoading) {
      this.isLoadingFAQsList = true;
    }
    let FAQsDataSubscription: Subscription = this.fAQsService.getFAQsList().pipe(
      tap((res: any) => {
        if (res?.code === 200) {
          this.FAQsList = res.data;
          this.handleFAQsList();
        } else {
          this.handleError(res?.message);
        }
      }),
      catchError(err => {
        this.handleError(err);
        return []; // Return an empty array or appropriate fallback value
      }),
      finalize(() => {
        this.FAQsList = [1, 2, 3, 4, 5];
        this.isLoadingFAQsList = false;
        this.updateMetaTagsForSEO(); // Remove After Function Working Successfully
      })
    ).subscribe();

    this.subscriptions.push(FAQsDataSubscription);
  }
  private handleFAQsList(): void {
    this.updateMetaTagsForSEO();
  }
  /* --- Start FAQs List Functions --- */

  // Add Edit FAQ
  addEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditFaqComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add',
        typeValue: 'faq'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.faqs.editNew') : this.publicService?.translateTextFromJson('dashboard.faqs.addNew'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getFAQsList();
      }
    });
  }
  //Start Delete FAQ Functions
  deleteItem(item: any): void {
    const ref: any = this.dialogService.open(ConfirmDeleteComponent, {
      data: {
        selectedItem: true,
        enableConfirm: false,
      },
      header: this.publicService?.translateTextFromJson('general.confirm_delete'),
      dismissableMask: false,
      width: '35%',
    });
    ref?.onClose?.subscribe((res: any) => {
      if (res?.confirmed) {
        console.log(item);
        this.deleteItem(item);
      }
    });
  }
  deleteNow(item: any): void {
    console.log(item);
    this.publicService.showGlobalLoader.next(true);
    let deleteFaqSubscription: Subscription = this.fAQsService?.deleteFaqById(item?.item?.id)?.pipe(
      tap((res: any) => this.processDeleteResponse(res)),
      catchError(err => this.handleError(err)),
      finalize(() => {
        this.publicService.showGlobalLoader.next(false);
        this.cdr.detectChanges();
      })
    ).subscribe();
    this.subscriptions.push(deleteFaqSubscription);
  }
  private processDeleteResponse(res: any): void {
    if (res.status === 200) {
      this.handleSuccess(res.message);
      this.getFAQsList();
    } else {
      this.handleSuccess(res.message);
    }
  }
  //End Delete FAQ Functions

  /* --- Handle api requests messages --- */
  private handleSuccess(msg: string | null): any {
    this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'succss');
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
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
