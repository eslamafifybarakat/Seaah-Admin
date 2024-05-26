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
import { AddEditBankComponent } from '../add-edit-bank/add-edit-bank.component';
import { BankCardComponent } from '../bank-card/bank-card.component';
import { AddEditUsersComponent } from '../../../users/add-edit-users/add-edit-users.component';
// import { ShowExpensesModalComponent } from '../show-expenses-modal/show-expenses-modal.component';

@Component({
  selector: 'app-banks-list',
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
    BankCardComponent,
    SkeletonComponent
  ],
  templateUrl: './banks-list.component.html',
  styleUrls: ['./banks-list.component.scss']
})
export class BanksListComponent {
  private subscriptions: Subscription[] = [];

  dataStyleType: string = 'list';

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  // Start Banks List Variables
  isLoadingBanksList: boolean = false;
  banksList: any[] = [];
  banksCount: number = 0;
  tableHeaders: any = [];
  // End Banks List Variables

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
  statusesList: any = [];
  isLoadingStatuses: boolean = false;
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
      { field: 'bankName', header: 'dashboard.tableHeader.name', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'addressName', header: 'dashboard.tableHeader.location', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.location'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
      { field: 'start_time', header: 'dashboard.tableHeader.startTime', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.startTime'), type: 'time' },
      { field: 'end_time', header: 'dashboard.tableHeader.endTime', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.endTime'), type: 'time' },
      { field: 'installment_ways', header: 'dashboard.tableHeader.installmentWays', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.installmentWays'), type: 'filterArray', dataType: 'array' },
      { field: 'usersCount', header: 'dashboard.tableHeader.usersCount', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.usersCount'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false },
    ];
    this.updateMetaTagsForSEO();
    this.getAllBanks();
  }
  private updateMetaTagsForSEO(): void {
    let metaData: MetaDetails = {
      title: 'البنوك | سعة',
      description: 'البنوك | سعة',
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

  // Start Banks List Functions
  getAllBanks(isFiltering?: boolean): void {
    this.isSearch ? this.publicService.showGlobalLoader.next(true) : this.isLoadingBanksList = true;
    let kidsSubscription: Subscription = this.banksService?.getBanksList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null, this.statusValue ?? null)
      .pipe(
        tap((res: any) => {
          this.processBanksListResponse(res);
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this.finalizeBankListLoading())
      ).subscribe();
    this.subscriptions.push(kidsSubscription);
  }
  private processBanksListResponse(response: any): void {
    if (response.status == 200) {
      this.banksCount = response?.data?.total || 0;
      this.pagesCount = Math.ceil(this.banksCount / this.perPage);
      this.banksList = response?.data?.items;
      this.banksList?.forEach((element: any) => {
        element['active'] = false;

        let nameBbj: any = JSON.parse(element?.name || '{}');
        element['bankName'] = nameBbj[this.currentLanguage];
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
  private finalizeBankListLoading(): void {
    this.isLoadingBanksList = false;
    this.isLoadingSearch = false;
    this.enableSortFilter = false;
    this.publicService.showGlobalLoader.next(false);
    setTimeout(() => {
      this.enableSortFilter = true;
    }, 200);
  }
  // End Banks List Functions

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
        this.getAllBanks();
      }
    });
  }
  // End Add User Modal

  // Bank Details
  itemDetails(item?: any): void {
    this.router.navigate(['/Dashboard/Organizations/Banks/Details/' + item?.id]);
  }
  // Add Edit Bank
  addEditItem(item?: any, type?: any): void {
    const ref = this.dialogService?.open(AddEditBankComponent, {
      data: {
        item,
        type: type == 'edit' ? 'edit' : 'add',
        typeValue: 'bank'
      },
      header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.banks.editBank') : this.publicService?.translateTextFromJson('dashboard.banks.addBank'),
      dismissableMask: false,
      width: '60%',
      styleClass: 'custom-modal',
    });
    ref.onClose.subscribe((res: any) => {
      if (res?.listChanged) {
        if (this.banksCount == 0) {
          this.getAllBanks();
        } else {
          this.page = 1;
          this.publicService?.changePageSub?.next({ page: this.page });
          this.dataStyleType == 'grid' ? this.changePageActiveNumber(1) : '';
          this.dataStyleType == 'grid' ? this.getAllBanks() : '';
        }
      }
    });
  }
  //Start Delete Bank Functions
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
      this.getAllBanks();
    } else {
      this.handleSearch(res.message);
    }
  }
  //End Delete Bank Functions

  // Start Search Functions
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.perPage = 10;
    this.searchKeyword = keyWord;
    this.isSearch = true;
    this.isLoadingBanksList = true;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.banksList?.length <= 0 && this.dataStyleType == 'list' ? this.getAllBanks(true) : '';
    this.dataStyleType == 'grid' ? this.getAllBanks() : '';
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.banksList?.length <= 0 && this.dataStyleType == 'list' ? this.getAllBanks(true) : '';
    this.dataStyleType == 'grid' ? this.getAllBanks() : '';
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
    //     this.getAllBanks(true);
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
    this.getAllBanks();
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
    this.getAllBanks();
  }
  // Sort table Functions
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllBanks();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllBanks();
    }
  }

  // Start Pagination Functions
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllBanks();
  }
  onPaginatorOptionsChange(e: any): void {
    this.perPage = e?.value;
    this.pagesCount = Math?.ceil(this.banksCount / this.perPage);
    this.page = 1;
    this.publicService?.changePageSub?.next({ page: this.page });
    this.dataStyleType == 'grid' ? this.getAllBanks() : '';
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
