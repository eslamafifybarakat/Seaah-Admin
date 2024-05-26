// Modules
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

// Components
import { DynamicTableLocalActionsComponent } from '../../../../../shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { DynamicTableV2Component } from '../../../../../shared/components/dynamic-table-v2/dynamic-table-v2.component';
import { DynamicSvgComponent } from '../../../../../shared/components/icons/dynamic-svg/dynamic-svg.component';
import { DynamicTableComponent } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { SkeletonComponent } from '../../../../../shared/skeleton/skeleton/skeleton.component';

//Services
import { LocalizationLanguageService } from '../../../../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from '../../../../../services/generic/metadata.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from '../../../../../services/generic/alerts.service';
import { PublicService } from '../../../../../services/generic/public.service';
import { catchError, debounceTime, finalize, tap } from 'rxjs/operators';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { KidsService } from '../../../services/kids.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { BanksService } from '../../../services/banks.service';
import { AddEditUsersComponent } from '../../../users/add-edit-users/add-edit-users.component';
import { SchoolsService } from '../../../services/schools.service';
import { UniversityCardComponent } from '../university-card/university-card.component';
import { AddEditUniversityComponent } from '../add-edit-university/add-edit-university.component';
import { UniversitiesService } from '../../../services/universities.service';

@Component({
  selector: 'app-universities-list',
  standalone: true,
  imports: [
     // Modules
     ReactiveFormsModule,
     TranslateModule,
     PaginatorModule,
     CommonModule,
     FormsModule,
 
     // Components
     DynamicTableLocalActionsComponent,
     DynamicTableV2Component,
     DynamicTableComponent,
     DynamicSvgComponent,
     UniversityCardComponent,
     SkeletonComponent
  ],
  templateUrl: './universities-list.component.html',
  styleUrls: ['./universities-list.component.scss']
})
export class UniversitiesListComponent {
  private subscriptions: Subscription[] = [];

  dataStyleType: string = 'list';

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  // Start Universities List Variables
  isLoadingUniversitiesList: boolean = false;
  universitiesList: any[] = [];
  universitiesCount: number = 0;
  tableHeaders: any = [];
  // End Universities List Variables

  // Start Pagination Variables
  page: number = 1;
  perPage: number = 10;
  pagesCount: number = 0;
  rowsOptions: number[] = [10, 15, 30];
  @ViewChild('paginator') paginator: Paginator | undefined;
  // End Pagination Variables

  // Start Filtration Variables
  private searchSubject = new Subject<any>();
  filterCards: any = [];

  enableSortFilter: boolean = true;
  searchKeyword: any = null;
  filtersArray: any = [];
  sortObj: any = {};
  // End Filtration Variables

  // Start Permissions Variables
  showActionTableColumn: boolean = false;
  showEditAction: boolean = false;
  showToggleAction: boolean = false;
  showActionFiles: boolean = false;
  // End Permissions Variables
  currentLanguage: string;

  // Dropdown Element
  @ViewChild('dropdown') dropdown: any;


  // Statuses Variables
  statusValue: string | number | null;
  // Statuses Variables

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private confirmationService: ConfirmationService,
    private metadataService: MetadataService,
    private publicService: PublicService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private banksService: BanksService,
    private schoolsService: SchoolsService,
    private universitiesService: UniversitiesService,
    private kidsService: KidsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }
  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();
    this.loadData();
    this.searchSubject.pipe(
      debounceTime(500) // Throttle time in milliseconds (1 seconds)
    ).subscribe(event => { this.searchHandler(event) });
  }
  private loadData(): void {
    this.tableHeaders = [
      { field: 'image_path', header: '', title: '', type: 'img' },
      { field: 'universityName', header: 'dashboard.tableHeader.name', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'addressName', header: 'dashboard.tableHeader.location', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.location'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'start_time', header: 'dashboard.tableHeader.startTime', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.startTime'), type: 'time' },
      { field: 'end_time', header: 'dashboard.tableHeader.endTime', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.endTime'), type: 'time' },
      { field: 'usersCount', header: 'dashboard.tableHeader.usersCount', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.usersCount'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
    ];
    this.updateMetaTagsForSEO();
    this.getAllScools();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'الجامعات | سعة',
      description: 'الجامعات | سعة',
      image: 'https://ik.imagekit.io/2cvha6t2l9/Logo.jpeg?updatedAt=1712577283111'
    }
    this.metadataService.updateMetaTagsForSEO(metaData);
  }

  //Check if Filteration
  ifFilteration(): boolean {
    if (this.hasValue(this.searchKeyword) || this.isArrayNotEmpty(this.filtersArray) || this.isObjectNotEmpty(this.sortObj)) {
      return true;
    } else {
      return false
    }
  }
  // Function to check if a variable is not null or undefined
  hasValue<T>(variable: T | null | undefined): boolean {
    return variable !== null && variable !== undefined;
  }
  // Function to check if an array is not empty
  isArrayNotEmpty<T>(array: T[]): boolean {
    return this.hasValue(array) && array.length > 0;
  }
  // Function to check if an object has at least one key
  isObjectNotEmpty<T>(obj: T): boolean {
    return this.hasValue(obj) && Object.keys(obj).length > 0;
  }

  // Toggle data style table or card
  changeDateStyle(type: string): void {
    type == 'grid' ? this.perPage = 16 : this.perPage = 10;
    this.clearTable();
    this.dataStyleType = type;
  }

  // Start Universities List Functions
  getAllScools(isFiltering?: boolean): void {
    this.isSearch ? this.publicService.showGlobalLoader.next(true) : this.isLoadingUniversitiesList = true;
    let universitiesServiceSubscription: Subscription = this.universitiesService?.getUniversitiesList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null, this.statusValue ?? null)
      .pipe(
        tap((res: any) => {
          this.processuniversitiesServiceListResponse(res);
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeuniversitiesServiceList())
      ).subscribe();
    this.subscriptions.push(universitiesServiceSubscription);
  }
  private processuniversitiesServiceListResponse(response: any): void {
    if (response.status == 200) {
      this.universitiesCount = response?.data?.total || 0;
      this.pagesCount = Math.ceil(this.universitiesCount / this.perPage);
      this.universitiesList = response?.data?.items;
      this.universitiesList?.forEach((element: any) => {
        element['active'] = false;

        let nameBbj: any = JSON.parse(element?.name || '{}');
        element['universityName'] = nameBbj[this.currentLanguage];
        let addressBbj: any = JSON.parse(element?.location || '{}');
        element['addressName'] = addressBbj[this.currentLanguage];
        // installment ways
        element?.installment_ways?.forEach((item: any) => {
          let nameObj: any = JSON.parse(item?.name || '{}');
          item['name'] = nameObj[this.currentLanguage];
        });
        // Users 
        // element['users'] = [{
        //   id: 1,
        //   name: 'user',
        //   phone: '512142142',
        //   iqama_No: '1234567890',
        //   email: 'eslam@eslam.com',
        //   organization_id: 1,
        //   type: 'bank',
        //   source_register: 'web',
        //   type_coming_otp: 'email',
        //   password: '123456'
        // }];
        element['usersCount'] = element?.users?.length>0 ? element?.users?.length :'0';
      });
    } else {
      this.handleError(response.message);
      return;
    }
  }
  private finalizeuniversitiesServiceList(): void {
    this.isLoadingUniversitiesList = false;
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showGlobalLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
  }
  // End Universities List Functions

  // Start Add User Modal
  addUser(event: any): void {
    const ref: any = this.dialogService?.open(AddEditUsersComponent, {
      data: {
        type: 'add',
        organizationData: event
      },
      header: this.publicService?.translateTextFromJson('dashboard.users.addUser'),
      dismissableMask: false,
      width: '50%',
      styleClass: 'custom-modal',
    });
    ref?.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        this.getAllScools();
      }
    });
  }
  // End Add User Modal

  // University Details
  itemDetails(item?: any): void {
    this.router.navigate(['/Dashboard/Organizations/Universities/Details/' + item?.id]);
  }
  // Add Edit University
  addEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditUniversityComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add',
        typeValue: 'bank'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.universities.editUniversity') : this.publicService?.translateTextFromJson('dashboard.universities.addUniversity'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        if (this.universitiesCount == 0) {
          this.getAllScools();
        } else {
          this.page = 1;
          this.publicService?.changePageSub?.next({ page: this.page });
          this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
          this.dataStyleType == 'grid' ? this.getAllScools() : '';
        }
      }
    });
  }
  //Start Delete School Functions
  deleteItem(item: any): void {
    if (!item?.confirmed) {
      return;
    }
    this.publicService.showGlobalLoader.next(true);
    let deleteBankSubscription: Subscription = this.banksService?.deleteBankById(item?.item?.id)?.pipe(
      tap((res: any) => this.processDeleteResponse(res)),
      catchError(err => this.handleError(err)),
      finalize(() => {
        this.publicService.showGlobalLoader.next(false);
        this.cdr.detectChanges();
      })
    ).subscribe();
    this.subscriptions.push(deleteBankSubscription);
  }
  private processDeleteResponse(res: any): void {
    if (res.status === 200) {
      this.handleSuccess(res.message);
      this.getAllScools();
    } else {
      this.handleSearch(res.message);
    }
  }
  //End Delete School Functions

  // Start Search Functions
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.perPage = 10;
    this.searchKeyword = keyWord;
    this.isSearch = true;
    this.isLoadingUniversitiesList = true;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.universitiesList?.length <= 0 && this.dataStyleType == 'list' ? this.getAllScools(true) : '';
    this.dataStyleType == 'grid' ? this.getAllScools() : '';
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.universitiesList?.length <= 0 && this.dataStyleType == 'list' ? this.getAllScools(true) : '';
    this.dataStyleType == 'grid' ? this.getAllScools() : '';
    this.publicService?.changePageSub?.next({ page: this.page });

  }
  // End Search Functions

  // Filter Users Modal Function
  filterItemModal(): void {
    // const ref = this.dialogService?.open(FilterKidsComponent, {
    //   header: this.publicService?.translateTextFromJson('general.filter'),
    //   dismissableMask: false,
    //   width: '45%',
    //   data: this.filterCards,
    //   styleClass: 'custom-modal',
    // });
    // ref.onClose.subscribe((res: any) => {
    //   if (res) {
    //     this.page = 1;
    //     this.filtersArray = res.conditions;
    //     this.filterCards = res.conditions;
    //     this.getAllScools(true);
    //   }
    // });
  }
  // filter Table Functions
  filterItemsTable(event: any): void {
    this.filtersArray = [];
    Object.keys(event)?.forEach((key: any) => {
      this.tableHeaders?.forEach((colHeader: any) => {
        if (colHeader?.field == key) {
          event[key]?.forEach((record: any) => {
            record['type'] = colHeader?.type;
          });
        }
      });
    });
    Object.keys(event).forEach((key: any) => {
      event[key]?.forEach((record: any) => {
        if (record['type'] && record['value'] !== null) {
          let filterData;
          if (record['type'] == 'text' || record['type'] == 'date' || record['type'] == 'numeric' || record['type'] == 'status') {
            let data: any;
            if (record['type'] == 'date') {
              data = new Date(record?.value?.setDate(record?.value?.getDate() + 1));
              record.value = new Date(record?.value?.setDate(record?.value?.getDate() - 1));
            } else {
              data = record?.value;
            }

            filterData = {
              column: key,
              type: record?.type,
              data: data,
              operator: record?.matchMode
            }
          }

          else if (record['type'] == 'filterArray') {
            let arr: any = [];
            record?.value?.forEach((el: any) => {
              arr?.push(el?.id || el?.value);
            });
            if (arr?.length > 0) {
              filterData = {
                column: key,
                type: 'relation',
                data: arr
              }
            }
          }
          else if (record['type'] == 'boolean') {
            filterData = {
              column: key,
              type: record?.type,
              data: record?.value
            }
          }
          if (filterData) {
            this.filtersArray?.push(filterData);
          }
        }
      });
    });
    this.page = 1;
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllScools();
  }
  // Clear table Function
  clearTable(): void {
    this.searchKeyword = '';
    this.sortObj = {};
    this.filtersArray = [];
    this.page = 1;
    this.isSearch = false;
    this.publicService.resetTable.next(true);
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllScools();
  }
  // Sort table Functions
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllScools();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllScools();
    }
  }

  // Start Pagination Functions
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllScools();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.universitiesCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.getAllScools() : '';
  }
  changePageActiveNumber(number: number): void {
    this.paginator?.changePage(number - 1);
  }
  // End Pagination Functions

  // Hide dropdown to not make action when keypress on keyboard arrows
  hide(): void {
    this.dropdown?.accessibleViewChild?.nativeElement?.blur();
  }

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
