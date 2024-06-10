import { SkeletonComponent } from './../../../../../../shared/skeleton/skeleton/skeleton.component';
// Services
import { LocalizationLanguageService } from 'src/app/services/generic/localization-language.service';
import { MetaDetails, MetadataService } from 'src/app/services/generic/metadata.service';
import { PublicService } from 'src/app/services/generic/public.service';
// Modules
import { AlertsService } from 'src/app/services/generic/alerts.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { FAQsService } from 'src/app/components/dashboard/services/faqs.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AddEditFaqComponent } from '../add-edit-faq/add-edit-faq.component';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-faqs-list',
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    PaginatorModule,
    DropdownModule,
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
  currentLanguage: string = '';

  /* --- Start FAQs List Variables --- */
  FAQsList: any = [];
  isLoadingFAQsList: boolean = false;
  faqsCount: number = 0;
  /* --- End FAQs List Variables --- */

  // Start Pagination Variables
  page: number = 1;
  perPage: number = 10;
  pagesCount: number = 0;
  rowsOptions: number[] = [5, 10, 15, 30];
  @ViewChild('paginator') paginator: Paginator | undefined;
  @ViewChild('dropdown') dropdown: any;
  // End Pagination Variables

  searchKeyword: any = null;

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
    this.currentLanguage = this.publicService.getCurrentLanguage();
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
        if (res?.status === 200) {
          this.FAQsList = res?.data?.data;
          this.faqsCount = res?.data?.total;
          this.FAQsList.forEach((item: any) => {
            item['title'] = item.title[this.currentLanguage];
            item['description'] = item.description[this.currentLanguage];
          });
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
        // [1, 2, 3, 4, 5].forEach(element => {
        //   this.FAQsList.push({
        //     id: 1,
        //     title: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدهاالتطبيق.',
        //     description: ' هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص.هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثلهذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي'
        //   })
        // });
        this.isLoadingFAQsList = false;
        // this.updateMetaTagsForSEO(); // Remove After Function Working Successfully
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
      width: '40%',
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
        this.deleteNow(item);
      }
    });
  }
  deleteNow(item: any): void {
    this.publicService.showGlobalLoader.next(true);
    let deleteFaqSubscription: Subscription = this.fAQsService?.deleteFaqById(item?.id)?.pipe(
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
  // Start Pagination Functions
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getFAQsList();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.faqsCount / this.perPage);
    this.page = 1;
    this.getFAQsList();
  }
  changePageActiveNumber(number: number): void {
    this.paginator?.changePage(number - 1);
  }
  // Hide dropdown to not make action when keypress on keyboard arrows
  hide(): void {
    this.dropdown?.accessibleViewChild?.nativeElement?.blur();
  }
  // End Pagination Functions

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
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
