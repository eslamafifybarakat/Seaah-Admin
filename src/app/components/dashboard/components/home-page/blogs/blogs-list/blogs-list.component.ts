import { SkeletonComponent } from './../../../../../../shared/skeleton/skeleton/skeleton.component';
import { FAQsService } from './../../../../services/faqs.service';
import { AlertsService } from './../../../../../../services/generic/alerts.service';
import { PublicService } from './../../../../../../services/generic/public.service';
import { MetaDetails, MetadataService } from './../../../../../../services/generic/metadata.service';
import { LocalizationLanguageService } from './../../../../../../services/generic/localization-language.service';
import { ConfirmDeleteComponent } from './../../../../../../shared/components/confirm-delete/confirm-delete.component';
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, catchError, finalize, tap } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';
import { BlogsService } from 'src/app/components/dashboard/services/blogs.service';
import { blogsAr, blogsEn } from './blogs';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { AddEditBlogComponent } from '../add-edit-blog/add-edit-blog.component';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-blogs-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, BlogCardComponent, SkeletonComponent, PaginatorModule, DropdownModule],
  templateUrl: './blogs-list.component.html',
  styleUrls: ['./blogs-list.component.scss']
})
export class BlogsListComponent {
  private subscriptions: Subscription[] = [];
  private imageBaseUrl: string = '';
  private metaDetails: MetaDetails | undefined;
  private fullPageUrl: string = '';
  currentLanguage: string = '';

  /* --- Start Blogs List Variables --- */
  blogsList: any = [];
  isLoadingBlogsList: boolean = false;
  blogsCount: number = 0;
  /* --- End Blogs List Variables --- */

  // Start Pagination Variables
  page: number = 1;
  perPage: number = 10;
  pagesCount: number = 0;
  rowsOptions: number[] = [10, 15, 30];
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
    private blogsService: BlogsService,
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
    this.getBlogsList();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'المدونات',
      description: 'المدونات'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  /* --- Start Blogs List Functions --- */
  getBlogsList(preventLoading?: boolean): void {
    if (!preventLoading) {
      this.isLoadingBlogsList = true;
    }
    let blogsDataSubscription: Subscription = this.blogsService.getBlogsList(this.page, this.perPage, this.searchKeyword).pipe(
      tap((res: any) => {
        if (res?.status === 200) {
          this.blogsList = res?.data?.data;
          this.blogsCount = res?.data?.total;
          this.blogsList.forEach((item: any) => {
            item['title'] = item.title[this.currentLanguage];
            item['description'] = item.description[this.currentLanguage];
          });
          this.handleBlogsList();
        } else {
          this.handleError(res?.message);
        }
      }),
      catchError(err => {
        this.handleError(err);
        return []; // Return an empty array or appropriate fallback value
      }),
      finalize(() => {
        this.isLoadingBlogsList = false;
      })
    ).subscribe();

    this.subscriptions.push(blogsDataSubscription);
  }
  private handleBlogsList(): void {
    this.updateMetaTagsForSEO();
  }
  /* --- Start Blogs List Functions --- */

  // Add Edit Blog
  addEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditBlogComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add',
        typeValue: 'faq'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.blogs.editBlog') : this.publicService?.translateTextFromJson('dashboard.blogs.addBlog'),
      dismissableMask: false,
      width: '45%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getBlogsList();
      }
    });
  }
  //Start Delete Blog Functions
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
        this.deleteNow(item);
      }
    });
  }
  deleteNow(item: any): void {
    console.log(item);
    this.publicService.showGlobalLoader.next(true);
    let deleteFaqSubscription: Subscription = this.blogsService?.deleteBlogById(item?.id)?.pipe(
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
      this.getBlogsList();
    } else {
      this.handleSuccess(res.message);
    }
  }
  //End Delete Blog Functions


  // Start Pagination Functions
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getBlogsList();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.blogsCount / this.perPage);
    this.page = 1;
    this.getBlogsList();
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
