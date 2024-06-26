import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, Subscription, debounceTime, tap } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { PublicService } from 'src/app/services/generic/public.service';
import { TranslateModule } from '@ngx-translate/core';
import { PaginatorModule } from 'primeng/paginator';
import { DynamicTableLocalActionsComponent } from 'src/app/shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { DynamicTableV2Component } from 'src/app/shared/components/dynamic-table-v2/dynamic-table-v2.component';
import { DynamicSvgComponent } from 'src/app/shared/components/icons/dynamic-svg/dynamic-svg.component';
import { SkeletonComponent } from 'src/app/shared/skeleton/skeleton/skeleton.component';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-orgnization-users',
  standalone: true,
  imports: [
     // Modules
     TranslateModule,
     PaginatorModule,
     CommonModule,
 
     // Components
     DynamicTableLocalActionsComponent,
     DynamicTableV2Component,
     DynamicSvgComponent,
     UserCardComponent,
     SkeletonComponent,
  ],
  templateUrl: './orgnization-users.component.html',
  styleUrls: ['./orgnization-users.component.scss']
})
export class OrgnizationUsersComponent {
  private subscriptions: Subscription[] = [];
  @Input() items:any=[];
  @Output() handleDeleteUser: EventEmitter<any> = new EventEmitter();
  @Output() handleAddUser: EventEmitter<any> = new EventEmitter();

  dataStyleType: string = 'list';

  isLoadingSearch: boolean = false;
  isSearch: boolean = false;

  // Start Users List Variables
  isLoadingUsersList: boolean = false;
  usersList: any = [];
  usersCount: number = 0;
  tableHeaders: any = [];
  // End Users List Variables

  // Start Pagination Variables
  page: number = 1;
  perPage: number = 10;
  pagesCount: number = 0;
  rowsOptions: number[] = [5, 10, 15, 30];
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

  // Dropdown Element
  @ViewChild('dropdown') dropdown: any;

  constructor(
    private publicService:PublicService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(700) // Throttle time in milliseconds (1 seconds)
    ).subscribe(event => { this.searchHandler(event) });
    this.loadData();
    console.log(this.items);
  }
  private loadData(): void {
    this.tableHeaders = [
      { field: 'name', header: 'dashboard.tableHeader.name', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.name'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, },
      { field: 'email', header: 'dashboard.tableHeader.email', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.email'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, },
      { field: 'phone', header: 'dashboard.tableHeader.mobilePhone', title: this.publicService?.translateTextFromJson('dashboard.tableHeader.mobilePhone'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, },
      { field: 'iqama_No', header: 'labels.nationalIdentify', title: this.publicService?.translateTextFromJson('labels.nationalIdentify'), type: 'text', sort: false, showDefaultSort: true, showAscSort: false, showDesSort: false, filter: false, },
    ];
    // if (this.showMeta) {
    //   this.updateMetaTagsForSEO();
    // }
    this.getAllUsers();
  }
  private updateMetaTagsForSEO(): void {
    // let metaData: MetaDetails = {
    //   title: 'المستخدمين',
    //   description: 'المستخدمين',
    //   image: 'https://ik.imagekit.io/2cvha6t2l9/Logo.jpeg?updatedAt=1712577283111'
    // }
    // this.metadataService.updateMetaTagsForSEO(metaData);
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

  // Start Users List Functions
  getAllUsers(isFiltering?: boolean): void {
    this.usersList=this.items;
    this.usersCount = this.usersList?.length;
    this.pagesCount = Math.ceil(this.usersCount / this.perPage);

    // isFiltering ? this.publicService.showSearchLoader.next(true) : this.isLoadingUsersList = true;
    // let usersSubscription: Subscription = this.usersService?.getUsersList(this.page, this.perPage, this.searchKeyword, this.sortObj, this.filtersArray ?? null)
    //   .pipe(
    //     tap((res: any) => this.processUsersListResponse(res)),
    //     catchError(err => this.handleError(err)),
    //     finalize(() => this.finalizeUserList())
    //   ).subscribe();
    // this.subscriptions.push(usersSubscription);
  }
  private processUsersListResponse(response: any): void {
    if (response.message) {
      this.usersCount = response.data.total;
      this.pagesCount = Math.ceil(this.usersCount / this.perPage);
      this.usersList = response?.data?.items;
      // this.usersListTable = [];
      // this.usersList.forEach(element => {
      //   this.usersListTable.push(element.user)
      // });
    } else {
      this.handleError(response.message);
      return;
    }
  }
  private finalizeUserList(): void {
    // this.isLoadingUsersList = false;
    // this.isLoadingSearch = false;
    // this.enableSortFilter = false;
    // this.publicService.showSearchLoader.next(false);
    // setTimeout(() => {
    //   this.enableSortFilter = true;
    // }, 200);
  }
  // End Users List Functions

  itemDetails(item?: any): void {
    this.router.navigate(['Dashboard/Users/Details/' + item.id]);
  }
  // Add User
  addItem(item?: any, type?: any): void {
    this.handleAddUser.emit('Add');
    // const ref = this.dialogService?.open(AddClientComponent, {
    //   data: {
    //     item,
    //     type: type == 'edit' ? 'edit' : 'add'
    //   },
    //   header: type == 'edit' ? this.publicService?.translateTextFromJson('dashboard.customers.editCustomer') : this.publicService?.translateTextFromJson('dashboard.customers.addCustomer'),
    //   dismissableMask: false,
    //   width: '60%',
    //   styleClass: 'custom-modal',
    // });
    // ref.onClose.subscribe((res: any) => {
    //   if (res?.listChanged) {
    //     this.page = 1;
    //     this.publicService?.changePageSub?.next({ page: this.page });
    //     this.dataStyleType == 'grid' ? this.getAllUsers() : '';
    //   }
    // });
  }
  // Edit User
  editItem(item: any): void {
    this.router.navigate(['Dashboard/Clients/Details/' + item.id]);
  }
  //Start Delete User Functions
  deleteItem(item: any): void {
    this.handleDeleteUser.emit(item);
    if (!item?.confirmed) {
      return;
    }
    const data = {
      name: item?.item?.name
    };
    // this.publicService.showGlobalLoader.next(true);
    // let deleteUserSubscription: Subscription = this.usersService?.deleteUserById(item?.item?.id, data)?.pipe(
    //   tap((res: UsersListApiResponse) => this.processDeleteResponse(res)),
    //   catchError(err => this.handleError(err)),
    //   finalize(() => {
    //     this.publicService.showGlobalLoader.next(false);
    //     this.cdr.detectChanges();
    //   })
    // ).subscribe();
    // this.subscriptions.push(deleteUserSubscription);
  }
  private processDeleteResponse(res: any): void {
    if (res.status === 200) {
      this.handleSuccess(res.message);
      this.getAllUsers();
    } else {
      this.handleError(res.message);
    }
  }
  //End Delete User Functions

  // Start Search Functions
  handleSearch(event: any): void {
    this.searchSubject.next(event);
  }
  searchHandler(keyWord: any): void {
    this.page = 1;
    this.perPage = 10;
    this.searchKeyword = keyWord;
    this.isLoadingUsersList = true;
    this.getAllUsers(true);
    if (keyWord?.length > 0) {
      this.isLoadingSearch = true;
    }
    this.cdr.detectChanges();
  }
  clearSearch(search: any): void {
    search.value = null;
    this.searchKeyword = null;
    this.getAllUsers(true);
  }
  // End Search Functions

  // Filter Users Modal Function
  filterItemModal(): void {
    // const ref = this.dialogService?.open(FilterClientsComponent, {
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
    //     this.getAllUsers(true);
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
    this.getAllUsers();
  }
  // Clear table Function
  clearTable(): void {
    // this.searchKeyword = '';
    // this.sortObj = {};
    // this.filtersArray = [];
    // this.page = 1;
    // this.publicService.resetTable.next(true);
    // this.publicService?.changePageSub?.next({ page: this.page });
    this.getAllUsers();
  }
  // Sort table Functions
  sortItems(event: any): void {
    if (event?.order == 1) {
      this.sortObj = {
        column: event?.field,
        order: 'asc'
      }
      this.getAllUsers();
    } else if (event?.order == -1) {
      this.sortObj = {
        column: event?.field,
        order: 'desc'
      }
      this.getAllUsers();
    }
  }

  // Start Pagination Functions
  onPageChange(e: any): void {
    this.page = e?.page + 1;
    this.getAllUsers();
  }
  onPaginatorOptionsChange(e: any): void {
    // this.perPage = e?.value;
    // this.pagesCount = Math?.ceil(this.usersCount / this.perPage);
    // this.page = 1;
    // this.publicService?.changePageSub?.next({ page: this.page });
    // this.dataStyleType == 'grid' ? this.getAllUsers() : '';
  }
  // End Pagination Functions

  // Hide dropdown to not make action when keypress on keyboard arrows
  hide(): void {
    this.dropdown?.accessibleViewChild?.nativeElement?.blur();
  }

  /* --- Handle api requests messages --- */
  private handleSuccess(msg: string | null): any {
    // this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'success');
  }
  private handleError(err: string | null): any {
    // this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'), 'error');
  }
  private setMessage(message: string, type?: string | null): void {
    // this.alertsService.openToast(type, type, message);
    // this.publicService.showGlobalLoader.next(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
