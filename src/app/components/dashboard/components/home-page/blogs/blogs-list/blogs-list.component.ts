import { SkeletonComponent } from './../../../../../../shared/skeleton/skeleton/skeleton.component';
import { FAQsService } from './../../../../services/faqs.service';
import { AlertsService } from './../../../../../../services/generic/alerts.service';
import { PublicService } from './../../../../../../services/generic/public.service';
import { MetaDetails, MetadataService } from './../../../../../../services/generic/metadata.service';
import { LocalizationLanguageService } from './../../../../../../services/generic/localization-language.service';
import { ConfirmDeleteComponent } from './../../../../../../shared/components/confirm-delete/confirm-delete.component';
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, catchError, finalize, tap } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';
import { BlogsService } from 'src/app/components/dashboard/services/blogs.service';
import { blogsAr, blogsEn } from './blogs';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { AddEditBlogComponent } from '../add-edit-blog/add-edit-blog.component';

@Component({
  selector: 'app-blogs-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, BlogCardComponent, SkeletonComponent],
  templateUrl: './blogs-list.component.html',
  styleUrls: ['./blogs-list.component.scss']
})
export class BlogsListComponent {
  private subscriptions: Subscription[] = [];
  private imageBaseUrl: string = '';
  private metaDetails: MetaDetails | undefined;
  private fullPageUrl: string = '';
  currentLanguage: string = '';
  /* --- Start FAQs List Variables --- */
  blogsList: any = [];
  isLoadingBlogsList: boolean = false;
  blogsCount: number = 0;
  /* --- End FAQs List Variables --- */

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
    let blogsDataSubscription: Subscription = this.blogsService.getBlogsList().pipe(
      tap((res: any) => {
        if (res?.code === 200) {
          this.blogsList = res.data;
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
        this.blogsList = this.currentLanguage == 'ar' ? blogsAr : blogsEn;

        this.isLoadingBlogsList = false;
        this.updateMetaTagsForSEO(); // Remove After Function Working Successfully
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
